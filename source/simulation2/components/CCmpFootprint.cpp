/* Copyright (C) 2010 Wildfire Games.
 * This file is part of 0 A.D.
 *
 * 0 A.D. is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * 0 A.D. is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 0 A.D.  If not, see <http://www.gnu.org/licenses/>.
 */

#include "precompiled.h"

#include "simulation2/system/Component.h"
#include "ICmpFootprint.h"

#include "ICmpObstructionManager.h"
#include "ICmpPosition.h"
#include "simulation2/MessageTypes.h"
#include "maths/FixedVector2D.h"

class CCmpFootprint : public ICmpFootprint
{
public:
	static void ClassInit(CComponentManager& UNUSED(componentManager))
	{
	}

	DEFAULT_COMPONENT_ALLOCATOR(Footprint)

	const CSimContext* m_Context;

	EShape m_Shape;
	CFixed_23_8 m_Size0; // width/radius
	CFixed_23_8 m_Size1; // height/radius
	CFixed_23_8 m_Height;

	static std::string GetSchema()
	{
		return
			"<choice>"
				"<element name='Square'>"
					"<attribute name='width'><ref name='positiveDecimal'/></attribute>"
					"<attribute name='depth'><ref name='positiveDecimal'/></attribute>"
				"</element>"
				"<element name='Circle'>"
					"<attribute name='radius'><ref name='positiveDecimal'/></attribute>"
				"</element>"
			"</choice>"
			"<element name='Height'>"
				"<ref name='nonNegativeDecimal'/>"
			"</element>";
	}

	virtual void Init(const CSimContext& context, const CParamNode& paramNode)
	{
		m_Context = &context;

		if (paramNode.GetChild("Square").IsOk())
		{
			m_Shape = SQUARE;
			m_Size0 = paramNode.GetChild("Square").GetChild("@width").ToFixed();
			m_Size1 = paramNode.GetChild("Square").GetChild("@depth").ToFixed();
		}
		else if (paramNode.GetChild("Circle").IsOk())
		{
			m_Shape = CIRCLE;
			m_Size0 = m_Size1 = paramNode.GetChild("Circle").GetChild("@radius").ToFixed();
		}
		else
		{
			// Error - pick some default
			m_Shape = CIRCLE;
			m_Size0 = m_Size1 = CFixed_23_8::FromInt(1);
		}

		m_Height = paramNode.GetChild("Height").ToFixed();
	}

	virtual void Deinit(const CSimContext& UNUSED(context))
	{
	}

	virtual void Serialize(ISerializer& UNUSED(serialize))
	{
	}

	virtual void Deserialize(const CSimContext& context, const CParamNode& paramNode, IDeserializer& UNUSED(deserialize))
	{
		Init(context, paramNode);
	}

	virtual void GetShape(EShape& shape, CFixed_23_8& size0, CFixed_23_8& size1, CFixed_23_8& height)
	{
		shape = m_Shape;
		size0 = m_Size0;
		size1 = m_Size1;
		height = m_Height;
	}

	virtual CFixedVector3D PickSpawnPoint(entity_id_t spawned)
	{
		CFixedVector3D error(CFixed_23_8::FromInt(-1), CFixed_23_8::FromInt(-1), CFixed_23_8::FromInt(-1));

		CmpPtr<ICmpPosition> cmpPosition(*m_Context, GetEntityId());
		if (cmpPosition.null() || !cmpPosition->IsInWorld())
			return error;

		CmpPtr<ICmpObstructionManager> cmpObstructionManager(*m_Context, SYSTEM_ENTITY);
		if (cmpObstructionManager.null())
			return error;

		// Always approximate the spawned entity as a circle, so we're orientation-independent
		CFixed_23_8 spawnedRadius;

		CmpPtr<ICmpFootprint> cmpSpawnedFootprint(*m_Context, spawned);
		if (!cmpSpawnedFootprint.null())
		{
			EShape shape;
			CFixed_23_8 size0, size1, height;
			cmpSpawnedFootprint->GetShape(shape, size0, size1, height);
			if (shape == CIRCLE)
				spawnedRadius = size0;
			else
				spawnedRadius = std::max(size0, size1); // safe overapproximation of the correct sqrt((size0/2)^2 + (size1/2)^2)
		}
		else
		{
			// No footprint - weird but let's just pretend it's a point
			spawnedRadius = CFixed_23_8::FromInt(0);
		}

		// The spawn point should be far enough from this footprint to fit the unit, plus a little gap
		CFixed_23_8 clearance = spawnedRadius + CFixed_23_8::FromInt(2);

		CFixedVector3D initialPos = cmpPosition->GetPosition();
		entity_angle_t initialAngle = cmpPosition->GetRotation().Y;

		if (m_Shape == CIRCLE)
		{
			CFixed_23_8 radius = m_Size0 + clearance;

			// Try equally-spaced points around the circle, starting from the front and expanding outwards in alternating directions
			const ssize_t numPoints = 31;
			for (ssize_t i = 0; i < (numPoints+1)/2; i = (i > 0 ? -i : 1-i)) // [0, +1, -1, +2, -2, ... (np-1)/2, -(np-1)/2]
			{
				entity_angle_t angle = initialAngle + (entity_angle_t::Pi()*2).Multiply(entity_angle_t::FromInt(i)/numPoints);

				CFixed_23_8 s, c;
				sincos_approx(angle, s, c);

				CFixedVector3D pos (initialPos.X + s.Multiply(radius), CFixed_23_8::Zero(), initialPos.Z + c.Multiply(radius));

				SkipTagObstructionFilter filter(spawned); // ignore collisions with the spawned entity
				if (cmpObstructionManager->TestCircle(filter, pos.X, pos.Z, spawnedRadius))
					return pos; // this position is okay, so return it
			}
		}
		else
		{
			CFixed_23_8 s, c;
			sincos_approx(initialAngle, s, c);

			for (size_t edge = 0; edge < 4; ++edge)
			{
				// Try equally-spaced points along the edge, starting from the middle and expanding outwards in alternating directions
				const ssize_t numPoints = 9;

				// Compute the direction and length of the current edge
				CFixedVector2D dir;
				CFixed_23_8 sx, sy;
				switch (edge)
				{
				case 0:
					dir = CFixedVector2D(c, -s);
					sx = m_Size0;
					sy = m_Size1;
					break;
				case 1:
					dir = CFixedVector2D(-s, -c);
					sx = m_Size1;
					sy = m_Size0;
					break;
				case 2:
					dir = CFixedVector2D(s, c);
					sx = m_Size1;
					sy = m_Size0;
					break;
				case 3:
					dir = CFixedVector2D(-c, s);
					sx = m_Size0;
					sy = m_Size1;
					break;
				}
				CFixedVector2D center;
				center.X = initialPos.X + (-dir.Y).Multiply(sy/2 + clearance);
				center.Y = initialPos.Z + dir.X.Multiply(sy/2 + clearance);
				dir = dir.Multiply((sx + clearance*2) / (numPoints-1));

				for (ssize_t i = 0; i < (numPoints+1)/2; i = (i > 0 ? -i : 1-i)) // [0, +1, -1, +2, -2, ... (np-1)/2, -(np-1)/2]
				{
					CFixedVector2D pos (center + dir*i);

					SkipTagObstructionFilter filter(spawned); // ignore collisions with the spawned entity
					if (cmpObstructionManager->TestCircle(filter, pos.X, pos.Y, spawnedRadius))
						return CFixedVector3D(pos.X, CFixed_23_8::Zero(), pos.Y); // this position is okay, so return it
				}
			}
		}

		return error;
	}
};

REGISTER_COMPONENT_TYPE(Footprint)
