/**
 * Automated Unit Tester.
 *
 * One can specify templates to be tested for unit balance.
 * Per wave one can specify a number of groups of units with the same owner, template,
 * amount, startpoint - Endpoint and action.
 * {number} Id - Owner player of units .
 * {string} template - Template name of units.
 * {number} amount - Number of units in the group.
 * {triggerPoint} StartPoint - unit spawnPoint.
 * {triggerPoint} EndPoint - unit target point.
 * {object} actionData - Way to reach the endPoint.
 * {string} [stance] - UnitAI stance for the group, if not specified default unit stance will be used.
 * {string} [formation] - The formation the group will use.
 * {number} [delay] - Time in ms after which the units will be ordered (default 0). TODO spawning
 */

const cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);

/**
 * Possible start and end points.
 * TODO add more points
 */
const points = {
	"north": cmpTrigger.GetTriggerPoints("A")[0],
	"south": cmpTrigger.GetTriggerPoints("B")[0],
	"middle": cmpTrigger.GetTriggerPoints("C")[0]
};

/**
 * Tests to run.
 */
const tests = [
{
	"group1": {
		"Id": 0,
		"template": "units/iber_champion_infantry",
		"amount": 10,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "patrol", "queued": true, "targetClasses": ["Unit -Ship"], "allowCapture": false },
		"stance": "violent",
		"formation": "formations/box"
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.north,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_infantry_slinger_e",
		"amount": 1,
		"startPoint": points.north,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined },
		"delay": 5000
	},
	"group2": {
		"Id": 2,
		"template": "units/iber_infantry_slinger_e",
		"amount": 1,
		"startPoint": points.south,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_infantry_swordsman_e",
		"amount": 50,
		"startPoint": points.north,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/iber_infantry_swordsman_b",
		"amount": 50,
		"startPoint": points.south,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group3": {
		"Id": 3,
		"template": "units/iber_infantry_swordsman_b",
		"amount": 50,
		"startPoint": points.north,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group4": {
		"Id": 1,
		"template": "units/iber_infantry_swordsman_b",
		"amount": 50,
		"startPoint": points.north,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_champion_infantry",
		"amount": 50,
		"startPoint": points.north,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template":
		"units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.south,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/cart_champion_cavalry",
		"amount": 50,
		"startPoint": points.south,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/cart_champion_infantry",
		"amount": 50,
		"startPoint": points.middle,
		"endPoint": points.north,
		"action": "walk"
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_infantry_swordsman_e",
		"amount": 100,
		"startPoint": points.middle,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/iber_infantry_swordsman_e",
		"amount": 100,
		"startPoint": points.middle,
		"endPoint": points.north,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
{
	"group1": {
		"Id": 1,
		"template": "units/iber_infantry_swordsman_e",
		"amount": 100,
		"startPoint": points.middle,
		"endPoint": points.middle,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
	"group2": {
		"Id": 2,
		"template": "units/iber_infantry_swordsman_e",
		"amount": 100,
		"startPoint": points.north,
		"endPoint": points.south,
		"actionData": { "type": "attack-walk", "queued": true, "targetClasses": undefined }
	},
},
];

/**
 * Time in ms in which the next wave will forcestart.
 */
var forceTime = 10 * 60 * 1000;

/**
 * Timer for force waves.
 */
var forceTimer;

/**
 * Timer for victory messages.
 */
var winTimer;

/**
 * Amount of turns executed after all enemy's are destroyed, so arrows can land.
 */
var turnThreshold = 5;

/**
 * Current wave number.
 */
var wave = -1;

/**
 * Boolean for initialising new waves, avoiding units being listed twice.
 */
var inWaveCreate = false;

/**
 * Object of lists containing all entities present on map.
 */
var entities = {};

/**
 * Object of lists containing all entities destroyed in current wave.
 */
var killed = {};

Trigger.prototype.NewWave = function()
{
	inWaveCreate = true;

	if (forceTimer)
	{
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		cmpTimer.CancelTimer(forceTimer);
		forceTimer = undefined;
	}

	if (!tests[++wave])
	{
		this.printOutput("Tests have ended")
		return;
	}

	// Destroy old ents.
	for (let group in entities)
		for (let ent of entities[group])
			Engine.DestroyEntity(ent);

	// Spawn new ents.
	entities = {};
	killed = {};
	let totalEnts = 0;
	for (let group in tests[wave])
	{
		entities[group] = [];
		totalEnts += tests[wave][group].amount;

		killed[group] = [];
	}

	for (let i = 0; i < totalEnts; ++i)
	{
		let groups = [];
		for (let group in tests[wave])
			if (entities[group].length < tests[wave][group].amount)
				groups.push(group);

		let group = pickRandom(groups);
		entities[group].push(TriggerHelper.SpawnUnits(
			tests[wave][group].startPoint,
			tests[wave][group].template,
			1,
			tests[wave][group].Id
		)[0]);
	}

	// Order action to units.
	for (let group in tests[wave])
		this.DoAfterDelay(tests[wave][group].delay || 0, "orderActions", { "group": group });

	forceTimer = this.DoAfterDelay(forceTime, "forceNextWave", {});

	inWaveCreate = false;

	// Empty waves will be ended immediately.
	this.CheckVictory();
};

Trigger.prototype.orderActions = function(msg)
{
	if (tests[wave][msg.group].formation)
		ProcessCommand(tests[wave][msg.group].Id, {
			"type": "formation",
			"entities": entities[msg.group],
			"name": tests[wave][msg.group].formation
		});

	if (tests[wave][msg.group].stance)
		ProcessCommand(tests[wave][msg.group].Id, {
			"type": "stance",
			"entities": entities[msg.group],
			"name": tests[wave][msg.group].stance,
			"queued": true
		});

	let cmpEndPosition =  Engine.QueryInterface(tests[wave][msg.group].endPoint, IID_Position);
	if (!cmpEndPosition || !cmpEndPosition.IsInWorld())
		return;

	let endPos = cmpEndPosition.GetPosition();

	let data = tests[wave][msg.group].actionData;
	data.entities = entities[msg.group];
	data.x = endPos.x;
	data.z = endPos.z;
	data.target = data.target || endPos; // TODO slightly hacky

	ProcessCommand(tests[wave][msg.group].Id, data);
};

Trigger.prototype.forceNextWave = function()
{
	this.printOutput(this.GetBaseString() + "\nNo outcome, next wave started forcefully");
	this.NewWave();
};

Trigger.prototype.printOutput = function(string)
{
	// TODO warn is bad.
	warn(string);
};

Trigger.prototype.CheckVictory = function()
{
	let aliveIds = [];
	let aliveEnts = [];
	for (let group in tests[wave])
		if (entities[group] && entities[group].length)
		{
			if (aliveIds.indexOf(tests[wave][group].Id) == -1)
				aliveIds.push(tests[wave][group].Id);

			// No victory yet.
			if (aliveIds.length > 1)
				return;

			aliveEnts = aliveEnts.concat(entities[group]);
		}

	let message = this.GetBaseString();
	if (!aliveEnts.length)
	{
		this.printOutput(message + "\nNo units alive.");
		this.NewWave();
		return;
	}

	// TODO Make this output more comprehensive.
	// Prepare outcome message.
	// Unit may return in promoted template.
	let origMessage = "\nAlive units spawned as: ";

	for (let group in tests[wave])
		if (entities[group] && entities[group].length)
			origMessage += entities[group].length + "/" + tests[wave][group].amount + " " + tests[wave][group].template + ", ";

	origMessage = origMessage.slice(0, -2) + ".";

	message += "\nPlayer " + aliveIds[0] + " won and has left: ";
	let templates = [];
	let values = [];
	for (let ent of aliveEnts)
	{
		let cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);
		let temp = cmpTemplateManager.GetCurrentTemplateName(ent);

		let index = templates.indexOf(temp);
		if (index == -1)
		{
			templates.push(temp);
			values.push(1);
		}
		else
			++values[index];
	}

	for (let tempKey in templates)
		message += values[tempKey] + " " + templates[tempKey] + ", ";

	message = message.slice(0, -2) + ".";

	this.printOutput(message + origMessage + "\n");

	this.NewWave();
};

/**
 * Returns basic string printed on every result.
 */
Trigger.prototype.GetBaseString = function()
{
	let Ids = [];
	for (let group in tests[wave])
		if (Ids.indexOf(tests[wave][group].Id) == -1)
			Ids.push(tests[wave][group].Id);

	let message = "Outcome test number " + (wave+1) + "/" + tests.length + ":";
	for (let Id of Ids)
	{
		message += "\nPlayer " + Id + " with: "
		let amounts = [];
		let templates = [];
		for (let group in tests[wave])
		{
			if (Id != tests[wave][group].Id)
				continue;

			let index = templates.indexOf(tests[wave][group].template);
			if (index == -1)
			{
				templates.push(tests[wave][group].template);
				amounts.push(tests[wave][group].amount);
			}
			else
				amounts[index] += tests[wave][group].amount;
		}

		for (let tempKey in templates)
			message += amounts[tempKey] + " " + templates[tempKey] + ", ";

		message = message.slice(0, -2) + " vs "
	}

	return message.slice(0, -4) + ".";
};

Trigger.prototype.OwnershipChange = function(data)
{
	// Ignore hacky woman.
	if (wave == -1)
		return;

	// Add ent.
	if (data.from == -1)
	{
		// Don't add entities we already have.
		if (inWaveCreate)
			return;

		for (let group in tests[wave])
			if (entities[group].indexOf(data.entity) != -1)
				return;

		// Find group of correct player.
		// Most units putted in correct group on EntityRenamed.
		for (let group in tests[wave])
			if (data.to == tests[wave][group].Id)
			{
				entities[group].push(data.entity);
				return;
			}

		// Ignore
		return;
	}

	if (data.to != -1)
		return;

	// Kill ent.
	for (let group in tests[wave])
	{
		let index = entities[group].indexOf(data.entity);
		if (index != -1)
		{
			entities[group].splice(index, 1);
			killed[group].push(data.entity);
		}
	}

	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	if (winTimer)
		cmpTimer.CancelTimer(winTimer);

	winTimer = cmpTimer.SetTimeout(
		SYSTEM_ENTITY,
		IID_Trigger,
		"DoAction",
		cmpTimer.GetLatestTurnLength() * turnThreshold,
		{ "action": "CheckVictory", "data": {} });
};

Trigger.prototype.EntityRenamed = function(data)
{
	let nowGroup;
	for (let group in entities)
	{
		let index = entities[group].indexOf(data.entity);
		if (index != -1)
		{
			entities[group][index] = data.newentity;
			nowGroup = group;
		}
		else if (killed[group].indexOf(data.entity) != -1)
		{
			entities[group].push(data.newentity);
			nowGroup = group;
		}
	}

	if (nowGroup)
		for (let group in entities)
		{
			let index = entities[group].indexOf(data.newentity);
			if (index != -1 && group != nowGroup)
			{
				entities[group].splice(index, 1);
				return;
			}
		}
};

Trigger.prototype.OnGlobalInitGame = function()
{
	this.NewWave();
};

cmpTrigger.RegisterTrigger("OnOwnershipChanged", "OwnershipChange", { "enabled": true });
cmpTrigger.RegisterTrigger("OnEntityRenamed", "EntityRenamed", { "enabled": true });

