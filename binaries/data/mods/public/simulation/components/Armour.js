function Armour() {}

Armour.prototype.Schema =
	"<a:help>Controls the damage resistance of the unit.</a:help>" +
	"<a:example>" +
		"<Hack>10.0</Hack>" +
		"<Pierce>0.0</Pierce>" +
		"<Crush>5.0</Crush>" +
	"</a:example>" +
	"<element name='Hack' a:help='Hack damage protection'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='Pierce' a:help='Pierce damage protection'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='Crush' a:help='Crush damage protection'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<optional>" +
		"<element name='Foundation' a:help='Armour given to building foundations'>" +
			"<interleave>" +
				"<element name='Hack' a:help='Hack damage protection'>" +
					"<ref name='nonNegativeDecimal'/>" +
				"</element>" +
				"<element name='Pierce' a:help='Pierce damage protection'>" +
					"<ref name='nonNegativeDecimal'/>" +
				"</element>" +
				"<element name='Crush' a:help='Crush damage protection'>" +
					"<ref name='nonNegativeDecimal'/>" +
				"</element>" +
			"</interleave>" +
		"</element>" +
	"</optional>";

Armour.prototype.Init = function()
{
	this.invulnerable = false;
};

Armour.prototype.SetInvulnerability = function(invulnerability)
{
	this.invulnerable = invulnerability;
};

/**
 * Take damage according to the entity's armor.
 * Returns object of the form { "killed": false, "change": -12 }
 */
Armour.prototype.TakeDamage = function(hack, pierce, crush)
{
	if (this.invulnerable)
		return { "killed": false, "change": 0 };

	let cmpHealth = Engine.QueryInterface(this.entity, IID_Health);
	return cmpHealth.Reduce(this.GetDamage(hack, pierce, crush));
};

Armour.prototype.GetArmourStrengths = function()
{
	// Work out the armour values with technology effects
	let applyMods = (type, foundation) => {
		let strength;
		if (foundation) 
		{
			strength = +this.template.Foundation[type];
			type = "Foundation/" + type;
		}
		else
			strength = +this.template[type];

		return ApplyValueModificationsToEntity("Armour/" + type, strength, this.entity);
	};

	let foundation = Engine.QueryInterface(this.entity, IID_Foundation) && this.template.Foundation;

	return {
		"hack": applyMods("Hack", foundation),
		"pierce": applyMods("Pierce", foundation),
		"crush": applyMods("Crush", foundation)
	};
};

Armour.prototype.GetDamage = function(hack, pierce, crush)
{
	let armourStrengths = this.GetArmourStrengths();

	// Adjust damage values based on armour; exponential armour: damage = attack * 0.9^armour
	// Don't bother rounding, since HP is no longer integral.
	return hack * Math.pow(0.9, armourStrengths.hack) +
	       pierce * Math.pow(0.9, armourStrengths.pierce) +
	       crush * Math.pow(0.9, armourStrengths.crush);
};

/**
 * @param {number} time - RepeatTime of the attack.
 * @param {object} attackStrengths - Strengths of the different damage types.
 * @param {number} bonus - Multiplier for the attackStrengths.
 * @return {number} - Health reduced per ms for this attack.
 * TODO maybe scale CaptureValue to maxHP/maxCP?
 */
Armour.prototype.GetDPS = function(time, attackStrengths, bonus)
{
	return (this.GetDamage(attackStrengths.hack * bonus, attackStrengths.pierce * bonus, attackStrengths.crush * bonus) + attackStrengths.captureValue) / time;
};

Engine.RegisterComponentType(IID_DamageReceiver, "Armour", Armour);
