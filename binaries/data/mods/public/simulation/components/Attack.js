function Attack() {}

var g_AttackTypes = ["Melee", "Ranged", "Capture", "Slaughter"];

/**
 * Factor to be multiplied with attackrange to consider something 'Out of Range'.
 */
var g_rangeThreshold = 1.2;

Attack.prototype.bonusesSchema =
	"<optional>" +
		"<element name='Bonuses'>" +
			"<zeroOrMore>" +
				"<element>" +
					"<anyName/>" +
					"<interleave>" +
						"<optional>" +
							"<element name='Civ' a:help='If an entity has this civ then the bonus is applied'><text/></element>" +
						"</optional>" +
						"<element name='Classes' a:help='If an entity has all these classes then the bonus is applied'><text/></element>" +
						"<element name='Multiplier' a:help='The attackers attack strength is multiplied by this'><ref name='nonNegativeDecimal'/></element>" +
					"</interleave>" +
				"</element>" +
			"</zeroOrMore>" +
		"</element>" +
	"</optional>";

Attack.prototype.preferredClassesSchema =
	"<optional>" +
		"<element name='PreferredClasses' a:help='Space delimited list of classes preferred for attacking. If an entity has any of theses classes, it is preferred. The classes are in decending order of preference'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>";

Attack.prototype.restrictedClassesSchema =
	"<optional>" +
		"<element name='RestrictedClasses' a:help='Space delimited list of classes that cannot be attacked by this entity. If target entity has any of these classes, it cannot be attacked'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>";

Attack.prototype.Schema =
	"<a:help>Controls the attack abilities and strengths of the unit.</a:help>" +
	"<a:example>" +
		"<Melee>" +
			"<Hack>10.0</Hack>" +
			"<Pierce>0.0</Pierce>" +
			"<Crush>5.0</Crush>" +
			"<MaxRange>4.0</MaxRange>" +
			"<RepeatTime>1000</RepeatTime>" +
			"<Bonuses>" +
				"<Bonus1>" +
					"<Civ>pers</Civ>" +
					"<Classes>Infantry</Classes>" +
					"<Multiplier>1.5</Multiplier>" +
				"</Bonus1>" +
				"<BonusCavMelee>" +
					"<Classes>Cavalry Melee</Classes>" +
					"<Multiplier>1.5</Multiplier>" +
				"</BonusCavMelee>" +
			"</Bonuses>" +
			"<RestrictedClasses datatype=\"tokens\">Champion</RestrictedClasses>" +
			"<PreferredClasses datatype=\"tokens\">Cavalry Infantry</PreferredClasses>" +
		"</Melee>" +
		"<Ranged>" +
			"<Hack>0.0</Hack>" +
			"<Pierce>10.0</Pierce>" +
			"<Crush>0.0</Crush>" +
			"<MaxRange>44.0</MaxRange>" +
			"<MinRange>20.0</MinRange>" +
			"<ElevationBonus>15.0</ElevationBonus>" +
			"<PrepareTime>800</PrepareTime>" +
			"<RepeatTime>1600</RepeatTime>" +
			"<Projectile>" +
				"<ProjectileSpeed>50.0</ProjectileSpeed>" +
				"<Spread>2.5</Spread>" +
			"</Projectile>" +
			"<Bonuses>" +
				"<Bonus1>" +
					"<Classes>Cavalry</Classes>" +
					"<Multiplier>2</Multiplier>" +
				"</Bonus1>" +
			"</Bonuses>" +
			"<RestrictedClasses datatype=\"tokens\">Champion</RestrictedClasses>" +
			"<Splash>" +
				"<Shape>Circular</Shape>" +
				"<Range>20</Range>" +
				"<FriendlyFire>false</FriendlyFire>" +
				"<Hack>0.0</Hack>" +
				"<Pierce>10.0</Pierce>" +
				"<Crush>0.0</Crush>" +
			"</Splash>" +
		"</Ranged>" +
		"<Slaughter>" +
			"<Hack>1000.0</Hack>" +
			"<Pierce>0.0</Pierce>" +
			"<Crush>0.0</Crush>" +
			"<MaxRange>4.0</MaxRange>" +
		"</Slaughter>" +
	"</a:example>" +
	"<interleave>" +
		"<zeroOrMore>" +
			"<element>" +
				"<anyName/>" +
				"<interleave>" +
					"<optional>" +
						"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
					"</optional>" +
					"<optional>" +
						"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
					"</optional>" +
					"<optional>" +
						"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
					"</optional>" +
					"<optional>" +
						"<element name='CaptureValue' a:help='Capture points value'><ref name='nonNegativeDecimal'/></element>" +
					"</optional>" +
					"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
					"<optional>" +
						"<element name='MinRange' a:help='Minimum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
					"</optional>" +
					"<optional>"+
						"<element name='ElevationBonus' a:help='give an elevation advantage (in metres)'><ref name='nonNegativeDecimal'/></element>" +
					"</optional>" +
					"<optional>" +
						"<element name='PrepareTime' a:help='Time from the start of the attack command until the attack actually occurs (in milliseconds). This value relative to RepeatTime should closely match the \"event\" point in the actor&apos;s attack animation'>" +
							"<data type='nonNegativeInteger'/>" +
						"</element>" +
					"</optional>" +
					"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" + // TODO: it shouldn't be stretched
						"<data type='positiveInteger'/>" +
					"</element>" +
					"<optional>" +
						"<element name='Projectile'>" +
							"<interleave>" +
								"<element name='ProjectileSpeed' a:help='Speed of projectiles (in metres per second)'>" +
									"<ref name='positiveDecimal'/>" +
								"</element>" +
								"<element name='Spread' a:help='Standard deviation of the bivariate normal distribution of hits at 100 metres. A disk at 100 metres from the attacker with this radius (2x this radius, 3x this radius) is expected to include the landing points of 39.3% (86.5%, 98.9%) of the rounds.'><ref name='nonNegativeDecimal'/></element>" +
							"</interleave>" +
						"</element>" +
					"</optional>" +
					Attack.prototype.bonusesSchema +
					Attack.prototype.preferredClassesSchema + // TODO inline?
					Attack.prototype.restrictedClassesSchema + // TODO inline?
					"<optional>" +
						"<element name='Splash'>" +
							"<interleave>" +
								"<element name='Shape' a:help='Shape of the splash damage, can be circular or linear'><text/></element>" +
								"<element name='Range' a:help='Size of the area affected by the splash'><ref name='nonNegativeDecimal'/></element>" +
								"<element name='FriendlyFire' a:help='Whether the splash damage can hurt non enemy units'><data type='boolean'/></element>" +
								"<optional>" +
									"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
								"</optional>" +
								"<optional>" +
									"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
								"</optional>" +
								"<optional>" +
									"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
								"</optional>" +
								"<optional>" +
									"<element name='CaptureValue' a:help='Capture points value'><ref name='nonNegativeDecimal'/></element>" +
								"</optional>" +
								Attack.prototype.bonusesSchema +
							"</interleave>" +
						"</element>" +
					"</optional>" +
				"</interleave>" +
			"</element>" +
		"</zeroOrMore>" +
	"</interleave>";

Attack.prototype.Init = function()
{
};

Attack.prototype.Serialize = null; // we have no dynamic state to save

Attack.prototype.GetAttackTypes = function(wantedTypes)
{
	let types = g_AttackTypes.filter(type => !!this.template[type]);
	if (!wantedTypes)
		return types;

	let wantedTypesReal = wantedTypes.filter(wtype => wtype.indexOf("!") != 0);
	return types.filter(type => wantedTypes.indexOf("!" + type) == -1 &&
	      (!wantedTypesReal || !wantedTypesReal.length || wantedTypesReal.indexOf(type) != -1));
};

// TODO splash?
Attack.prototype.FilterCaptureTypes = function(types)
{
	return types.filter(type => !!this.template[type].CaptureValue);
};

Attack.prototype.GetPreferredClasses = function(type)
{
	if (this.template[type] && this.template[type].PreferredClasses &&
	    this.template[type].PreferredClasses._string)
		return this.template[type].PreferredClasses._string.split(/\s+/);

	return [];
};

Attack.prototype.GetRestrictedClasses = function(type)
{
	if (this.template[type] && this.template[type].RestrictedClasses &&
	    this.template[type].RestrictedClasses._string)
		return this.template[type].RestrictedClasses._string.split(/\s+/);

	return [];
};

Attack.prototype.CanAttack = function(target, wantedTypes)
{
	let cmpFormation = Engine.QueryInterface(target, IID_Formation);
	if (cmpFormation)
		return true;

	let cmpThisPosition = Engine.QueryInterface(this.entity, IID_Position);
	let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
	if (!cmpThisPosition || !cmpTargetPosition || !cmpThisPosition.IsInWorld() || !cmpTargetPosition.IsInWorld())
		return false;
	let isTurret = cmpThisPosition.GetTurretParent() != INVALID_ENTITY

	let cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return false;
	let targetClasses = cmpIdentity.GetClassesList();

	let cmpEntityPlayer = QueryOwnerInterface(this.entity);
	let cmpTargetPlayer = QueryOwnerInterface(target);
	if (!cmpTargetPlayer || !cmpEntityPlayer)
		return false;

	let types = this.GetAttackTypes(wantedTypes);
	let captureTypes = this.FilterCaptureTypes(types);
	let entityOwner = cmpEntityPlayer.GetPlayerID();
	let targetOwner = cmpTargetPlayer.GetPlayerID();
	let cmpCapturable = QueryMiragedInterface(target, IID_Capturable);

	// Check if the relative height difference is larger than the attack range
	// If the relative height is bigger, it means they will never be able to
	// reach each other, no matter how close they come.
	let heightDiff = Math.abs(cmpThisPosition.GetHeightOffset() - cmpTargetPosition.GetHeightOffset());

	for (let type of types)
	{
		if (captureTypes.indexOf(type) == -1 && type != "Slaughter" && !cmpEntityPlayer.IsEnemy(targetOwner))
			continue;
		// TODO splash?
		if (this.template[type].CaptureValue && !this.template[type].Hack &&
		    !this.template[type].Pierce && !this.template[type].Crush &&
		   (!cmpCapturable || !cmpCapturable.CanCapture(entityOwner)))
			continue;

		if (type == "Slaughter" && targetClasses.indexOf("Domestic") == -1)
			continue;

		// If we are visisble garrisoned always do attacks with projectiles.
		if (isTurret && !this.template[type].projectile)
			continue;

		if (heightDiff > this.GetRange(type).max)
			continue;

		let restrictedClasses = this.GetRestrictedClasses(type);
		if (!restrictedClasses.length)
			return true;

		if (!MatchesClassList(targetClasses, restrictedClasses))
			return true;
	}

	return false;
};

/**
 * Returns null if we have no preference or the lowest index of a preferred class.
 */
Attack.prototype.GetPreference = function(target)
{
	const cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return undefined;

	const targetClasses = cmpIdentity.GetClassesList();

	let minPref = null;
	for (let type of this.GetAttackTypes())
	{
		let preferredClasses = this.GetPreferredClasses(type);
		for (let targetClass of targetClasses)
		{
			let pref = preferredClasses.indexOf(targetClass);
			if (pref === 0)
				return pref;
			if (pref != -1 && (minPref === null || minPref > pref))
				minPref = pref;
		}
	}
	return minPref;
};

/**
 * Get the full range of attack using all available attack types.
 */
Attack.prototype.GetFullAttackRange = function()
{
	let ret = { "min": Infinity, "max": 0 };
	for (let type of this.GetAttackTypes())
	{
		let range = this.GetRange(type);
		ret.min = Math.min(ret.min, range.min);
		ret.max = Math.max(ret.max, range.max);
	}
	return ret;
};

Attack.prototype.GetBestAttackAgainst = function(target, prefAttackTypes)
{
	// TODO: Formation against formation needs review
	let cmpFormation = Engine.QueryInterface(target, IID_Formation);
	if (cmpFormation)
		return g_AttackTypes.find(attack => this.GetAttackTypes(prefAttackTypes).indexOf(attack) != -1) ||
		       g_AttackTypes.find(attack => this.GetAttackTypes().indexOf(attack) != -1);

	let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
	if (!cmpPosition || !cmpPosition.IsInWorld())
		return undefined;

	let cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return undefined;

	let targetClasses = cmpIdentity.GetClassesList();
	let isTargetClass = className => targetClasses.indexOf(className) != -1;

	// Always slaughter domestic animals instead of using a normal attack.
	if (isTargetClass("Domestic") && this.template.Slaughter)
		return "Slaughter";

	let types = this.GetAttackTypes().filter(type => this.CanAttack(target, [type]));
	if (!types.length)
		return undefined;

	// When all prefTypes are not possible, but we can attack with another type, choose between these.
	let prefTypes = types.filter(type => this.GetAttackTypes(prefAttackTypes).indexOf(type) != -1);
	if (!prefTypes.length)
		prefTypes = types;

	if (prefTypes.length == 1)
		return prefTypes[0];

	// Choose an attack with capture over one without.
	let captureTypes = this.FilterCaptureTypes(prefTypes);
	if (captureTypes.length)
		prefTypes = captureTypes;

	let cmpDamageReceiver = QueryMiragedInterface(target, IID_DamageReceiver);
	if (!cmpDamageReceiver)
		return undefined;

	// Bad assumption, function should be moved to cmpObstructionManager, crashes for buildings.
	// TODO merge unitMotion rewrite
	let cmpUnitMotion = Engine.QueryInterface(this.entity, IID_UnitMotion);
	if (!cmpUnitMotion)
		return undefined;

	let totalRange = this.GetFullAttackRange();
	let chooseType;

	// TODO elevation?
	// When outside maxRange choose based on DPS.
	if (!cmpUnitMotion.IsInTargetRange(target, 0, g_rangeThreshold * totalRange.max))
	{
		let maxDPS = -1;
		for (let type of prefTypes)
		{
			let DPS = cmpDamageReceiver.GetDPS(
				this.GetTimers(type).repeat,
				this.GetAttackStrengths(type),
				this.GetAttackBonus(type, target));

			if (DPS > maxDPS || (DPS == maxDPS && this.GetRange(chooseType).max < this.GetRange(type).max)) 
			{
				maxDPS = DPS;
				chooseType = type;
			}
		}
		return chooseType;
	}

	// When inside minRange choose type with shortest range.
	if (cmpUnitMotion.IsInTargetRange(target, 0, g_rangeThreshold * totalRange.min))
	{
		let minRange = Infinity;
		for (let type of prefTypes)
		{
			let range = this.GetRange(type).min;
			if (minRange > range || (minRange == range && 
			    cmpDamageReceiver.GetDPS(this.GetTimers(type).repeat, this.GetAttackStrengths(type), this.GetAttackBonus(type, target)) >
			    cmpDamageReceiver.GetDPS(this.GetTimers(chooseType).repeat, this.GetAttackStrengths(chooseType), this.GetAttackBonus(chooseType, target))))
			{
				minRange = range;
				chooseType = type;
			}
		}
		return chooseType;
	}

	// When 'In Range' choose based on a DPS/range.
	let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
	if (!cmpTargetPosition || !cmpTargetPosition.IsInWorld())
		return undefined;

	let selfPosition = cmpPosition.GetPosition2D();
	let distanceToSquared = cmpTargetPosition.GetPosition2D().distanceToSquared(selfPosition);
	let maxDPSRange = -1;

	for (let type of prefTypes)
	{
		let maxRange = this.GetRange(type).max; // TODO elevation?
		let DPSRange = cmpDamageReceiver.GetDPS(
			this.GetTimers(type).repeat,
			this.GetAttackStrengths(type), 
			this.GetAttackBonus(type, target)) / Math.abs(g_rangeThreshold * maxRange - distanceToSquared / g_rangeThreshold / maxRange);

		if (DPSRange > maxDPSRange)
		{
			maxDPSRange = DPSRange;
			chooseType = type;
		}
	}
	return chooseType;
};

Attack.prototype.CompareEntitiesByPreference = function(a, b)
{
	let aPreference = this.GetPreference(a);
	let bPreference = this.GetPreference(b);

	if (aPreference === null && bPreference === null) return 0;
	if (aPreference === null) return 1;
	if (bPreference === null) return -1;
	return aPreference - bPreference;
};

Attack.prototype.GetTimers = function(type)
{
	return {
		"prepare": ApplyValueModificationsToEntity("Attack/" + type + "/PrepareTime", +(this.template[type].PrepareTime || 0), this.entity),
		"repeat": ApplyValueModificationsToEntity("Attack/" + type + "/RepeatTime", +this.template[type].RepeatTime, this.entity)
	};
};

Attack.prototype.GetAttackStrengths = function(type)
{
	// Work out the attack values with technology effects
	let template = this.template[type];
	let splash = "";
	if (!template)
	{
		template = this.template[type.split(".")[0]].Splash;
		splash = "/Splash";
	}

	let applyMods = damageType =>
		ApplyValueModificationsToEntity("Attack/" + type + splash + "/" + damageType, +(template[damageType] || 0), this.entity);

	return {
		"hack": applyMods("Hack"),
		"pierce": applyMods("Pierce"),
		"crush": applyMods("Crush"),
		"captureValue": applyMods("CaptureValue")
	};
};

Attack.prototype.GetSplashDamage = function(type)
{
	if (!this.template[type].Splash)
		return false;

	let splash = this.GetAttackStrengths(type + ".Splash");
	splash.friendlyFire = this.template[type].Splash.FriendlyFire != "false";
	splash.shape = this.template[type].Splash.Shape;
	return splash;
};

Attack.prototype.GetRange = function(type)
{
	let max = +this.template[type].MaxRange;
	max = ApplyValueModificationsToEntity("Attack/" + type + "/MaxRange", max, this.entity);

	let min = +(this.template[type].MinRange || 0);
	min = ApplyValueModificationsToEntity("Attack/" + type + "/MinRange", min, this.entity);

	let elevationBonus = +(this.template[type].ElevationBonus || 0);
	elevationBonus = ApplyValueModificationsToEntity("Attack/" + type + "/ElevationBonus", elevationBonus, this.entity);

	return { "max": max, "min": min, "elevationBonus": elevationBonus };
};

// Calculate the attack damage multiplier against a target
Attack.prototype.GetAttackBonus = function(type, target)
{
	let attackBonus = 1;
	let template = this.template[type];
	if (!template)
		template = this.template[type.split(".")[0]].Splash;

	if (template.Bonuses)
	{
		let cmpIdentity = Engine.QueryInterface(target, IID_Identity);
		if (!cmpIdentity)
			return 1;

		// Multiply the bonuses for all matching classes
		for (let key in template.Bonuses)
		{
			let bonus = template.Bonuses[key];
			if (bonus.Civ && bonus.Civ !== cmpIdentity.GetCiv())
				continue;
			if (bonus.Classes && bonus.Classes.split(/\s+/).some(cls => !cmpIdentity.HasClass(cls)))
				continue;
			attackBonus *= bonus.Multiplier;
		}
	}

	return attackBonus;
};

Attack.prototype.HasProjectile = function(type)
{
	return !!(this.template[type] && this.template[type].Projectile);
};

/**
 * Attack the target entity. This should only be called after a successful range check,
 * and should only be called after GetTimers().repeat msec has passed since the last
 * call to PerformAttack.
 */
Attack.prototype.PerformAttack = function(type, target)
{
	if (!this.CanAttack(target, [type]))
		return;

	let attackerOwner = Engine.QueryInterface(this.entity, IID_Ownership).GetOwner();
 	let cmpDamage = Engine.QueryInterface(SYSTEM_ENTITY, IID_Damage);

	let data = {
		"type": type,
		"attacker": this.entity,
		"target": target,
		"strengths": this.GetAttackStrengths(type),
		"multiplier": this.GetAttackBonus(type, target),
		"isSplash": false,
		"attackerOwner": attackerOwner
	};

	if (this.template[type].Splash)
	{
		data.friendlyFire = this.template[type].Splash.FriendlyFire != "false";
		data.isSplash = true;
		data.radius = +this.template[type].Splash.Range;
		data.shape = this.template[type].Splash.Shape;
		data.splashStrengths = this.GetAttackStrengths(type + ".Splash");
	}

	// When we have a projectile, launch it.
	if (this.template[type].Projectile)
	{
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		let turnLength = cmpTimer.GetLatestTurnLength()/1000;
		// In the future this could be extended:
		//  * Obstacles like trees could reduce the probability of the target being hit
		//  * Obstacles like walls should block projectiles entirely

		let horizSpeed = +this.template[type].Projectile.ProjectileSpeed;
		let gravity = 9.81; // this affects the shape of the curve; assume it's constant for now
		//horizSpeed /= 2; gravity /= 2; // slow it down for testing

		let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
		if (!cmpPosition || !cmpPosition.IsInWorld())
			return;
		let selfPosition = cmpPosition.GetPosition();
		let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
		if (!cmpTargetPosition || !cmpTargetPosition.IsInWorld())
			return;
		let targetPosition = cmpTargetPosition.GetPosition();

		let previousTargetPosition = Engine.QueryInterface(target, IID_Position).GetPreviousPosition();
		let targetVelocity = Vector3D.sub(targetPosition, previousTargetPosition).div(turnLength);

		let timeToTarget = this.PredictTimeToTarget(selfPosition, horizSpeed, targetPosition, targetVelocity);
		let predictedPosition = (timeToTarget !== false) ? Vector3D.mult(targetVelocity, timeToTarget).add(targetPosition) : targetPosition;

		// Add inaccuracy based on spread.
		let distanceModifiedSpread = ApplyValueModificationsToEntity("Attack/" + type + "/Projectile/Spread", +this.template[type].Projectile.Spread, this.entity) *
			targetPosition.horizDistanceTo(selfPosition) / 100;

		let randNorm = randomNormal2D();
		let offsetX = randNorm[0] * distanceModifiedSpread;
		let offsetZ = randNorm[1] * distanceModifiedSpread;

		let realTargetPosition = new Vector3D(predictedPosition.x + offsetX, targetPosition.y, predictedPosition.z + offsetZ);
		data.position = realTargetPosition;

		// Recalculate when the missile will hit the target position.
		let realHorizDistance = realTargetPosition.horizDistanceTo(selfPosition);
		timeToTarget = realHorizDistance / horizSpeed;

		data.direction = Vector3D.sub(realTargetPosition, selfPosition).div(realHorizDistance);

		// Launch the graphical projectile.
		let cmpProjectileManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ProjectileManager);
		data.projectileId = cmpProjectileManager.LaunchProjectileAtPoint(this.entity, realTargetPosition, horizSpeed, gravity);

		cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_Damage, "MissileHit", timeToTarget * 1000, data);
	}
	// Close attack, hurt the target immediately
	else
	{
		if (this.template[type].Splash)
		{
			let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
			if (!cmpPosition || !cmpPosition.IsInWorld())
				return;
			let selfPosition = cmpPosition.GetPosition();

			let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
			if (!cmpTargetPosition || !cmpTargetPosition.IsInWorld())
				return;
			let targetPosition = cmpTargetPosition.GetPosition();

			data.position = targetPosition;
			data.direction = new Vector3D.sub(targetPosition, selfPosition);
		}
		cmpDamage.CauseDamage(data);
	}
};

/**
 * Get the predicted time of collision between a projectile (or a chaser)
 * and its target, assuming they both move in straight line at a constant speed.
 * Vertical component of movement is ignored.
 * @param {Vector3D} selfPosition - the 3D position of the projectile (or chaser).
 * @param {number} horizSpeed - the horizontal speed of the projectile (or chaser).
 * @param {Vector3D} targetPosition - the 3D position of the target.
 * @param {Vector3D} targetVelocity - the 3D velocity vector of the target.
 * @return {Vector3D|boolean} - the 3D predicted position or false if the collision will not happen.
 */
Attack.prototype.PredictTimeToTarget = function(selfPosition, horizSpeed, targetPosition, targetVelocity)
{
	let relativePosition = new Vector3D.sub(targetPosition, selfPosition);
	let a = targetVelocity.x * targetVelocity.x + targetVelocity.z * targetVelocity.z - horizSpeed * horizSpeed;
	let b = relativePosition.x * targetVelocity.x + relativePosition.z * targetVelocity.z;
	let c = relativePosition.x * relativePosition.x + relativePosition.z * relativePosition.z;
	// The predicted time to reach the target is the smallest non negative solution
	// (when it exists) of the equation a t^2 + 2 b t + c = 0.
	// Using c>=0, we can straightly compute the right solution.

	if (c == 0)
		return 0;

	let disc = b * b - a * c;
	if (a < 0 || b < 0 && disc >= 0)
		return c / (Math.sqrt(disc) - b);

	return false;
}

Attack.prototype.OnValueModification = function(msg)
{
	if (msg.component != "Attack")
		return;

	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	if (!cmpUnitAI)
		return;

	if (this.GetAttackTypes().some(type =>
	      msg.valueNames.indexOf("Attack/" + type + "/MaxRange") != -1))
		cmpUnitAI.UpdateRangeQueries();
};

Engine.RegisterComponentType(IID_Attack, "Attack", Attack);
