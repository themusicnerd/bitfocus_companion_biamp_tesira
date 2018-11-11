var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(1,'Connecting'); // status ok!

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			witdth: 6,
			default: 23,
			regex: self.REGEX_PORT
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};


instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'recall':    {
			label: 'Recall a preset',
			options: [
				{
					type: 'textinput',
					label: 'Preset Number',
					id:   'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'fader-step': {
			label: '[Fader] Increment/Decrement',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'action',
					choices: [ 
						{ id: 'INC', label: 'Increment' }, 
						{ id: 'DEC', label: 'Decrement' } 
					]
				},
				{
					type: 'textinput',
					label: 'Amount',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'fader-set': {
			label: '[Fader] Set',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					default: 1,
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'fadermute-set': {
			label: '[Fader] Set Mute',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					default: 1,
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				},
			]
		},
		'mutebutton-set': {
			label: '[Mute Button] Set Mute',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					default: 1,
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				},
			]
		},
		'router-set': {
			label: '[Router] Set Crosspoint',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Input',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Output',
					id: 'index2',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				},
			]
		},
		'source-set': {
			label: '[Source Selection] Set Source',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Output',
					id: 'index2',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Source',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'sourcevolume-set': {
			label: '[Source Selection] Set Input Volume',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Input',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'leveler-set': {
			label: '[Leveler] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'comp-set': {
			label: '[Comp/Limiter] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'noise-set': {
			label: '[Noise Gate] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'duckerinputlevel-set': {
			label: '[Ducker] Set Input Level',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value'
				}
			]
		},
		'duckerlevelsense-set': {
			label: '[Ducker] Set Level Sense',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value'
				}
			]
		},
		'duckerbypass-set': {
			label: '[Ducker] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'duckersensemute-set': {
			label: '[Ducker] Set Sense Mute',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				}
			]
		},
		'duckerinputmute-set': {
			label: '[Ducker] Set Input Mute',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				}
			]
		},
		'xover2-set': {
			label: '[2-Way Crossover] Edit',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Filter Point',
					id: 'index1',
					choices: [ 
						{ id: '1', label: 'Low-Pass Cutoff' }, 
						{ id: '2', label: 'High-Pass Cutoff' } 
					]
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'xover3-set': {
			label: '[3-Way Crossover] Edit',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Filter Point',
					id: 'index1',
					choices: [ 
						{ id: '1', label: 'Low-Pass Cutoff' }, 
						{ id: '2', label: 'Middle Low Cutoff' },
						{ id: '3', label: 'Middle High Cutoff' }, 
						{ id: '2', label: 'High-Pass Cutoff' } 
					]
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'xover4-set': {
			label: '[4-Way Crossover] Edit',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Filter Point',
					id: 'index1',
					choices: [ 
						{ id: '1', label: 'Low-Pass Cutoff' },
						{ id: '2', label: 'Low-Mid Low Cutoff' },
						{ id: '3', label: 'Low-Mid High Cutoff' },
						{ id: '4', label: 'High-Mid Low Cutoff' },
						{ id: '5', label: 'High-Mid High Cutoff' },
						{ id: '6', label: 'High-Pass Cutoff' } 
					]
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'hpfcutoff-set': {
			label: '[HPF] Set Cutoff',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'hpfbypass-set': {
			label: '[HPF] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'lpfcutoff-set': {
			label: '[LPF] Set Cutoff',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'lpfbypass-set': {
			label: '[LPF] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'highshelfcutoff-set': {
			label: '[High Shelf] Set Cutoff',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'highshelfgain-set': {
			label: '[High Shelf] Set Gain',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Gain',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'highshelfbypass-set': {
			label: '[High Shelf] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'lowshelfcutoff-set': {
			label: '[Low Shelf] Set Cutoff',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'lowshelfgain-set': {
			label: '[Low Shelf] Set Gain',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Gain',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'lowshelfbypass-set': {
			label: '[Low Shelf] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'allpassbypass-set': {
			label: '[All Pass] Set Bypass (All)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'allpassbypassband-set': {
			label: '[All Pass] Set Bypass (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'allpasscenter-set': {
			label: '[All Pass] Set Center (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'allpassbw-set': {
			label: '[All Pass] Set Bandwidth (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Bandwidth',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'geqlevel-set': {
			label: '[GEQ] Set Level (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'geqbypass-set': {
			label: '[GEQ] Set Bypass',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'peqbypass-set': {
			label: '[PEQ] Set Bypass (All)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'peqbypassband-set': {
			label: '[PEQ] Set Bypass (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Active' }, 
						{ id: '1', label: 'Bypassed' } 
					]
				}
			]
		},
		'peqcenter-set': {
			label: '[PEQ] Set Center (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Frequency',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'peqpassbw-set': {
			label: '[PEQ] Set Bandwidth (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Bandwidth',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'peqlevel-set': {
			label: '[PEQ] Set Level (Band)',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Band',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'aingain-set': {
			label: '[Analog In] Set Gain',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Gain',
					id: 'value',
					choices: [ 
						{ id: '0', label: '0 dB' }, 
						{ id: '6', label: '6 dB' },
						{ id: '12', label: '12 dB' }, 
						{ id: '18', label: '18 dB' },
						{ id: '24', label: '24 dB' }, 
						{ id: '30', label: '30 dB' },
						{ id: '36', label: '36 dB' }, 
						{ id: '42', label: '42 dB' },
						{ id: '48', label: '48 dB' }, 
						{ id: '54', label: '54 dB' },
						{ id: '60', label: '60 dB' }, 
						{ id: '66', label: '66 dB' }
					]
				}
			]
		},
		'ainlevel-set': {
			label: '[Analog In] Set Level',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'ainphantom-set': {
			label: '[Analog In] Set Phantom Power',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Chanel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Off' }, 
						{ id: '1', label: 'On' } 
					]
				}
			]
		},
		'ainmute-set': {
			label: '[Analog In] Set Mute',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				}
			]
		},
		'ainpolarity-set': {
			label: '[Analog In] Set Polarity',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Polarity',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Normal' }, 
						{ id: '1', label: 'Inverted' } 
					]
				}
			]
		},
		'aecgain-set': {
			label: '[AEC In] Set Gain',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Gain',
					id: 'value',
					choices: [ 
						{ id: '0', label: '0 dB' }, 
						{ id: '6', label: '6 dB' },
						{ id: '12', label: '12 dB' }, 
						{ id: '18', label: '18 dB' },
						{ id: '24', label: '24 dB' }, 
						{ id: '30', label: '30 dB' },
						{ id: '36', label: '36 dB' }, 
						{ id: '42', label: '42 dB' },
						{ id: '48', label: '48 dB' }, 
						{ id: '54', label: '54 dB' },
						{ id: '60', label: '60 dB' }, 
						{ id: '66', label: '66 dB' }
					]
				}
			]
		},
		'aeclevel-set': {
			label: '[AEC In] Set Level',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Level',
					id: 'value',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'aecphantom-set': {
			label: '[AEC In] Set Phantom Power',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Chanel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Off' }, 
						{ id: '1', label: 'On' } 
					]
				}
			]
		},
		'aecmute-set': {
			label: '[AEC In] Set Mute',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Unmuted' }, 
						{ id: '1', label: 'Muted' } 
					]
				}
			]
		},
		'aecpolarity-set': {
			label: '[AEC In] Set Polarity',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Polarity',
					id: 'value',
					choices: [ 
						{ id: '0', label: 'Normal' }, 
						{ id: '1', label: 'Inverted' } 
					]
				}
			]
		},
		'aecenable-set': {
			label: '[AEC In] Enable AEC',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Polarity',
					id: 'AEC',
					choices: [ 
						{ id: '0', label: 'Off' }, 
						{ id: '1', label: 'On' } 
					]
				}
			]
		},
		'aecnlp-set': {
			label: '[AEC In] NLP Strength',
			options: [
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'device',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Instance ID',
					id: 'instance',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'index1',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Strength',
					id: 'AEC',
					choices: [ 
						{ id: '0', label: 'Off' }, 
						{ id: '1', label: 'Soft' },
						{ id: '2', label: 'Medium' }, 
						{ id: '3', label: 'Aggressove' } 
					]
				}
			]
		}
	})
}

instance.prototype.action = function(action) {
	var self = this
	var opt = action.options

	switch (action.action) {
		case 'recall':
			opt.action = 'RECALL'
			opt.device = '0'
			opt.attribute = 'PRESET'
			break
		
		case 'fader-step':
			opt.attribute = 'FDRLVL'
			break
		
		case 'fader-set':
			opt.action = 'SET'
			opt.attribute = 'FDRLVL'
			break
		
		case 'mutebutton-set':
			opt.action = 'SET'
			opt.attribute = 'MBMUTE'
			break

		case 'fadermute-set':
			opt.action = 'SET'
			opt.attribute = 'FDRMUTE'
			break

		case 'router-set':
			opt.action = 'SET'
			opt.attribute = 'RTRMUTEXP'
			break

		case 'source-set':
			opt.action = 'SET'
			opt.attribute = 'SRCSELSRC'
			break

		case 'sourcevolume-set':
			opt.action = 'SET'
			opt.attribute = 'SRCSELLVL'
			break

		case 'leveler-set':
			opt.action = 'SET'
			opt.attribute = 'LVLRBYP'
			break

		case 'comp-set':
			opt.action = 'SET'
			opt.attribute = 'CLIMBYP'
			break

		case 'noise-set':
			opt.action = 'SET'
			opt.attribute = 'NGBYP'
			break

		case 'duckerinputlevel-set':
			opt.action = 'SET'
			opt.attribute = 'DKRLVLIN'
			break

		case 'duckerlevelsense-set':
			opt.action = 'SET'
			opt.attribute = 'DKRLVLSENSE'
			break

		case 'duckerbypass-set':
			opt.action = 'SET'
			opt.attribute = 'DKRBYP'
			break

		case 'duckersensemute-set':
			opt.action = 'SET'
			opt.attribute = 'DKRMUTESENSE'
			break

		case 'duckerinputmute-set':
			opt.action = 'SET'
			opt.attribute = 'DKRMUTEIN'
			break

		case 'xover2-set':
			opt.action = 'SET'
			opt.attribute = 'XOVER2FC'
			break

		case 'xover3-set':
			opt.action = 'SET'
			opt.attribute = 'XOVER3FC'
			break

		case 'xover4-set':
			opt.action = 'SET'
			opt.attribute = 'XOVER4FC'
			break

		case 'hpfcutoff-set':
			opt.action = 'SET'
			opt.attribute = 'HPFLTFC'
			break

		case 'hpfbypass-set':
			opt.action = 'SET'
			opt.attribute = 'HPFLTBYP'
			break

		case 'lpfcutoff-set':
			opt.action = 'SET'
			opt.attribute = 'LPFLTFC'
			break

		case 'lpfbypass-set':
			opt.action = 'SET'
			opt.attribute = 'LPFLTBYP'
			break

		case 'highshelfcutoff-set':
			opt.action = 'SET'
			opt.attribute = 'HSFLTFC'
			break
			
		case 'highshelfgain-set':
			opt.action = 'SET'
			opt.attribute = 'HSFLTGAIN'
			break
			
		case 'highshelfbypass-set':
			opt.action = 'SET'
			opt.attribute = 'HSFLTBYP'
			break

		case 'lowshelfcutoff-set':
			opt.action = 'SET'
			opt.attribute = 'LSFLTFC'
			break
			
		case 'lowshelfgain-set':
			opt.action = 'SET'
			opt.attribute = 'LSFLTGAIN'
			break
			
		case 'lowshelfbypass-set':
			opt.action = 'SET'
			opt.attribute = 'LSFLTBYP'
			break

		case 'allpassbypass-set':
			opt.action = 'SET'
			opt.attribute = 'APFLBYPALL'
			break

		case 'allpassbypassband-set':
			opt.action = 'SET'
			opt.attribute = 'APFLTBYPBND'
			break

		case 'allpasscenter-set':
			opt.action = 'SET'
			opt.attribute = 'APFLBYPBND'
			break

		case 'allpassbw-set':
			opt.action = 'SET'
			opt.attribute = 'APFLTBWBND'
			break

		case 'geqlevel-set':
			opt.action = 'SET'
			opt.attribute = 'GEQLVLBND'
			break

		case 'geqbypass-set':
			opt.action = 'SET'
			opt.attribute = 'GEQBYPALL'
			break
		
		case 'peqbypass-set':
			opt.action = 'SET'
			opt.attribute = 'PEQBYPALL'
			break

		case 'peqbypassband-set':
			opt.action = 'SET'
			opt.attribute = 'PEQBYPBND'
			break

		case 'peqcenter-set':
			opt.action = 'SET'
			opt.attribute = 'PEQFCBND'
			break

		case 'peqbw-set':
			opt.action = 'SET'
			opt.attribute = 'PEQBWBND'
			break

		case 'peqlevel-set':
			opt.action = 'SET'
			opt.attribute = 'PEQLVLBND'
			break

		case 'aingain-set':
			opt.action = 'SET'
			opt.attribute = 'MICGAIN'
			break

		case 'ainlevel-set':
			opt.action = 'SET'
			opt.attribute = 'INPLVL'
			break

		case 'ainphantom-set':
			opt.action = 'SET'
			opt.attribute = 'PHPWR'
			break

		case 'ainmute-set':
			opt.action = 'SET'
			opt.attribute = 'INPMUTE'
			break

		case 'ainpolarity-set':
			opt.action = 'SET'
			opt.attribute = 'INPINVRT'
		break

		case 'aecgain-set':
			opt.action = 'SET'
			opt.attribute = 'AECMICGAIN'
			break

		case 'aeclevel-set':
			opt.action = 'SET'
			opt.attribute = 'AECINPLVL'
			break

		case 'aecphantom-set':
			opt.action = 'SET'
			opt.attribute = 'AECPHPWR'
			break

		case 'aecmute-set':
			opt.action = 'SET'
			opt.attribute = 'AECINPMUTE'
			break

		case 'aecpolarity-set':
			opt.action = 'SET'
			opt.attribute = 'AECINPINVRT'
		break

		case 'aecenable-set':
			opt.action = 'SET'
			opt.attribute = 'AECENABLE'
			break

		case 'aecnlp-set':
			opt.action = 'SET'
			opt.attribute = 'AECNLP'
		break

	}



	if (opt.action && opt.device && opt.attribute) {
		let cmd = `${opt.action} ${opt.device} ${opt.attribute}`
		if (opt.instance) {
			cmd = cmd + ' ' + opt.instance
		}	 
		if (opt.index1) {
			cmd = cmd + ' ' + opt.index1
		}
		if (opt.index2) {
			cmd = cmd + ' ' + opt.index2
		}
		if (opt.value) {
			cmd = cmd + ' ' + opt.value
		}

		debug(`Sending "${cmd}" to ${self.config.host}`)

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\n")
		} else {
			debug('Socket not connected :(')
		}

	}
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
