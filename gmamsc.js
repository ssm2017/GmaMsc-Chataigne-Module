// store the module path because path is changed when saving/loading .noisette file
var module_path = util.getEnvironmentVariable("USERPROFILE")+ "\\Documents\\Chataigne\\modules\\gmamsc-chataigne-module\\";

// sysex message values : this object is storing all the computed input sysex message
var smv = {};
/**
 * Reset the smv values
 */
function resetSmv() {
  smv = util.readFile(module_path+"smv.json", true);
}

/* **********************
          Utils
  *********************** */

/**
 * Convert the ascii sent value to a number (48 in decimals = 30 in ascii = 0; 57 in decimals = 39 in ascii = 9)
 * @param {int} int 
 * @returns {int} the number
 */
function asciiNbrToValue(int) {
  // yes, just remove the 3 (30=0; 39=9...)
  return parseInt(Integer.toHexString(int).substring(1,2))
}

/* **************************
      Parse sysex values
  *************************** */

/**
 * Parse the cue value from the sysex message (not for the "Set" method)
 * @param {array} data
 */
function parseCue(data) {
  smv.cue.msb_1.int = data[0];
  smv.cue.msb_1.value = asciiNbrToValue(data[0]);
  var separator_index = data.indexOf(46);
  var msb_size = separator_index;
  var lsb_size = (data.length - separator_index)-1;
  // msb
  if (msb_size > 1) {
    smv.cue.msb_2.int = data[1];
    smv.cue.msb_2.value = asciiNbrToValue(data[1]);
    if (msb_size > 2) {
      smv.cue.msb_3.int = data[2];
      smv.cue.msb_3.value = asciiNbrToValue(data[2]);
      smv.cue.msb.int = parseInt(""+ smv.cue.msb_1.value+ smv.cue.msb_2.value+ smv.cue.msb_3.value);
    }
    else {
      smv.cue.msb.int = parseInt(""+ smv.cue.msb_1.value+ smv.cue.msb_2.value);
    }
  }
  else {
    smv.cue.msb.int = parseInt(smv.cue.msb_1.value);
  }

  // lsb
  smv.cue.lsb_1.int = data[separator_index+1];
  smv.cue.lsb_1.value = asciiNbrToValue(data[separator_index+1]);
  if (lsb_size > 1) {
    smv.cue.lsb_2.int = data[separator_index+2];
    smv.cue.lsb_2.value = asciiNbrToValue(data[separator_index+2]);
    if (lsb_size > 2) {
      smv.cue.lsb_3.int = data[separator_index+3];
      smv.cue.lsb_3.value = asciiNbrToValue(data[separator_index+3]);
      smv.cue.lsb.int = parseInt(""+ smv.cue.lsb_1.value+ smv.cue.lsb_2.value+ smv.cue.lsb_3.value);
    }
    else {
      smv.cue.lsb.int = parseInt(""+ smv.cue.lsb_1.value+ smv.cue.lsb_2.value);
    }
  }
  else {
    smv.cue.lsb.int = parseInt(""+ smv.cue.lsb_1.value);
  }

  smv.cue.msb.value = smv.cue.msb.int;
  smv.cue.lsb.value = smv.cue.lsb.int;
}

/**
 * Parse the exec and page value from the sysex message (not for the "Set" method)
 * @param {array} data 
 */
function parseExecPage(data) {
  var separator_index = data.indexOf(46);
  if (separator_index == -1) {
    separator_index = data.indexOf(0);
    smv.device.exec_type.nice_value = "Exec Page";
    smv.device.exec_type.value = "exec_space_page";
  }
  else {
    smv.device.exec_type.nice_value = "Exec.Page";
    smv.device.exec_type.value = "exec_dot_page";
  }
  var exec_size = separator_index;
  var page_size = (data.length - separator_index)-1;
  // exec
  smv.exec.id_1.int = data[0];
  smv.exec.id_1.value = asciiNbrToValue(data[0]);
  if (exec_size > 1) {
    smv.exec.id_2.int = data[1];
    smv.exec.id_2.value = asciiNbrToValue(data[1]);
    if (exec_size > 2) {
      smv.exec.id_3.int = data[2];
      smv.exec.id_3.value = asciiNbrToValue(data[2]);
      smv.exec.id.int = parseInt(""+ smv.exec.id_1.value+ smv.exec.id_2.value+ smv.exec.id_3.value);
    }
    else {
      smv.exec.id.int = parseInt(""+ smv.exec.id_1.value+ smv.exec.id_2.value);
    }
  }
  else {
    smv.exec.id.int = parseInt(smv.exec.id_1.value);
  }

  // page
  smv.page.id_1.int = data[separator_index+1];
  smv.page.id_1.value = asciiNbrToValue(data[separator_index+1]);
  if (page_size > 1) {
    smv.page.id_2.int = data[separator_index+2];
    smv.page.id_2.value = asciiNbrToValue(data[separator_index+2]);
    if (page_size > 2) {
      smv.page.id_3.int = data[separator_index+3];
      smv.page.id_3.value = asciiNbrToValue(data[separator_index+3]);
      smv.page.id.int = parseInt(""+ smv.page.id_1.value+ smv.page.id_2.value+ smv.page.id_3.value);
    }
    else {
      smv.page.id.int = parseInt(""+ smv.page.id_1.value+ smv.page.id_2.value);
    }
  }
  else {
    smv.page.id.int = parseInt(smv.page.id_1.value);
  }
  smv.exec.id.value = smv.exec.id.int;
  smv.page.id.value = smv.page.id.int;
}

/**
 * Parse the time value
 * @param {int} hour 
 * @param {int} minute 
 * @param {int} second 
 * @param {int} frame 
 */
function parseTime(hour, minute, second, frame) {
  smv.time.hour.int = hour;
  smv.time.hour.value = hour;
  smv.time.minute.int = minute;
  smv.time.minute.value = minute;
  smv.time.second.int = second;
  smv.time.second.value = second;
  smv.time.frame.int = frame;
  smv.time.frame.value = frame;
}

/**
 * Display the sysex data with translation in the log
 * @param {array} sysex (the sysex message as array of bytes)
 */
function parseSysex(sysex) {
  // get the device type
  var exec_offset = (local.parameters.deviceParameters.deviceType.get() == "grandma")? 1:0;
  // realtime
  if (sysex[0] != 127) { return undefined; }
  smv.device.realtime.int = 127;
  smv.device.realtime.nice_value = "Yes";

  // device id
  smv.device.id.int = data[1];
  smv.device.send_to.nice_value = "All";
  smv.device.send_to.value = "all";
  if (data[1] < 127 && data[1] > 111) {
    smv.device.send_to.nice_value = "Group";
    smv.device.send_to.value = "group";
    smv.device.id.nice_value = "Group";
    smv.device.id.value = data[1] - 111;
  }
  else if (data[1] < 112) {
    smv.device.send_to.nice_value = "Device";
    smv.device.send_to.value = "device";
    smv.device.id.nice_value = "Device";
    smv.device.id.value = data[1];
  }

  // msc
  if (sysex[2] != 2) { return undefined; }
  smv.device.msc.int = 2;
  smv.device.msc.nice_value = "Yes";

  // command format
  smv.device.command_format.int = sysex[3];
  smv.device.command_format.nice_value = "All";
    smv.device.command_format.value = "all";
  if (sysex[3] == 2) {
    smv.device.command_format.nice_value = "Moving lights";
    smv.device.command_format.value = "moving_lights";
  }
  else if (sysex[3] == 1) {
    smv.device.command_format.nice_value = "General lights";
    smv.device.command_format.value = "general_lighting";
  }

  // command
  smv.command.int = sysex[4];
  smv.command.nice_value = "None";
  // go
  if (sysex[4] == 1) {
    smv.command.nice_value = "Go";
  }
  // stop
  else if (sysex[4] == 2){
    smv.command.nice_value = "Stop";
  }
  // resume
  else if (sysex[4] == 3){
    smv.command.nice_value = "Resume";
  }
  // timed go
  else if (sysex[4] == 4){
    smv.command.nice_value = "Timed go";
    parseTime(sysex[5], sysex[6], sysex[7], sysex[8]);
  }
  // set
  else if (sysex[4] == 6){
    smv.command.nice_value = "Set";
    // page / exec
    smv.page.id.int = sysex[6];
    smv.page.id.value = sysex[6];
    smv.exec.id.int = sysex[5]+exec_offset;
    smv.exec.id.value = sysex[5]+exec_offset;
    // fader
    smv.fader.level.fine.int = sysex[7];
    smv.fader.level.fine.value = sysex[7];
    smv.fader.level.coarse.int = sysex[8];
    smv.fader.level.coarse.value = sysex[8];
    smv.fader.level.int = coarseFineToFaderLevel(sysex[8], sysex[7]);
    smv.fader.level.value = smv.fader.level.int;
    // time ?
    if (sysex.length > 8) {
      parseTime(sysex[9], sysex[10], sysex[11], sysex[12]);
    }
    // the desk is ignoring exec type for the set method
    smv.device.exec_type.value = "exec_dot_page";
  }
  // fire
  else if (sysex[4] == 7){
    smv.command.nice_value = "Fire";
    smv.macro.id.int = sysex[5];
    smv.macro.id.value = sysex[5];
    smv.macro.id.nice_value = sysex[5];
    return smv;
  }
  // off
  else if (sysex[4] == 10){
    smv.command.nice_value = "Off";
  }
  else if (sysex[4] == 11){
    smv.command.nice_value = "Off";
  }

  // get cue and exec data
  if ([1,2,3,10,11].contains(sysex[4])) {
    var data = [];
    for (i=5; i<sysex.length; i++) {
      data.push(sysex[i]);
    }
    parseCue(data);
    // is it default ?
    smv.device.exec_type.nice_value = "Default Only";
    smv.device.exec_type.value = "default_only";
    if (data.length > 8){
      // get separator
      var separator_index = data.indexOf(0);
      parseExecPage(data.splice(separator_index+1, data.length));
    }
  }
}

/* **************************
             Log
  *************************** */

/**
 * Simple sysex log without interpretation
 * @param {array} data 
 */
function logSysex(data) {
  script.log("---------- log sysex start ----------");
  script.log("Length : "+ data.length);
  for(i=0;i<data.length;i++) {
    script.log("- "+i+" "+data[i] + " ("+ Integer.toHexString(data[i]).toUpperCase()+ ")");
  }
  script.log("---------- log sysex end ----------");
}

/**
 * Complex sysex log with interpretation
 */
function logInputSysex() {
  script.log("---------- log sysex start ----------");
  script.log("Length : "+ data.length);
  for(i=0;i<data.length;i++) {
    script.log("- "+i+" "+data[i] + " ("+ Integer.toHexString(data[i]).toUpperCase()+ ")");
  }
  script.log("---------- log sysex end ----------");
  script.log("---------- translation start ----------");
  // realtime
  script.log("- "+ smv.device.realtime.name+ " : "+ smv.device.realtime.nice_value);
  // device id
  script.log("- "+ smv.device.send_to.name+ " "+smv.device.send_to.nice_value+ " : "+ smv.device.id.value);
  // msc
  script.log("- "+ smv.device.msc.name+ " : "+ smv.device.msc.nice_value);
  // command format
  script.log("- "+ smv.device.command_format.name+ " : "+ smv.device.command_format.nice_value);
  // command
  script.log("- "+ smv.command.name+ " : "+ smv.command.nice_value);
  // exec type
  script.log("- "+ smv.device.exec_type.name+ " : "+ smv.device.exec_type.nice_value);
  // page
  if (smv.device.exec_type.value != "default_only") {
    script.log("- Page : "+ smv.page.id.value);
    script.log("- Exec : "+ smv.exec.id.value);
  }
  // cue
  if (smv.cue.msb.value != -1) {
    script.log("- Cue : "+ smv.cue.msb.value+ "."+ smv.cue.lsb.value);
  }
  // time
  if (smv.time.hour.value != -1) {
    script.log("- Time : "+ smv.time.hour.value+ ":"+ smv.time.minute.value+ ":"+ smv.time.second.value);
  }
  // fader value
  if (smv.fader.level.int != -1) {
    script.log("- Fader value : "+ smv.fader.level.int);
  }
  // macro
  if (smv.macro.id.int != -1) {
    script.log("- Macro : "+ smv.macro.id.int);
  }
  script.log("---------- translation end ----------");
}

/* **************************
    Fader level computation
  *************************** */

/**
 * Convert the hex values sent by the desk to 0 thru 100 level
 * @param {int} coarse (coarse value (byte 8))
 * @param {int} fine (fine value (byte 7))
 * @returns {int} (the fader level)
 */
function coarseFineToFaderLevel(coarse, fine) {
  return Math.round((((fine / 128) + coarse) / 1.28));
  //return (((fine / 128) + coarse) / 1.28);
}

/**
 * Get coarse and fine values to be sent to sysex
 * @param {int} fader_level
 * @returns {array} 0=coarse / 1=fine
 */
function faderLevelToCoarseFine(fader_level) {
  // multiply by 1.28
  var temp_coarse = fader_level * 1.28;

  // compute coarse (left side)
  var splitted = (""+temp_coarse).split('.');
  var coarse = parseInt(splitted[0]);

  // compute fine (right side * 128)
  var right_side = parseFloat("0."+(splitted[1]).substring(0,2));
  var temp_fine = right_side * 128;

  var fine = parseInt((""+temp_fine).split('.')[0]);

  return [coarse, fine];
}

/* **************************
          Add values
  *************************** */

/**
 * Get the custom variables group from page and exec
 * @param {int} page_id 
 * @param {int} exec_id 
 * @returns {object}
 */
function getCustomVariablesGroupByPageExec(page_id, exec_id) {
  // build names
  var group_name = "exec"+ page_id+ "_"+ exec_id;
  var group_nice_name = "Exec "+ page_id+ "_"+ exec_id;
  // get the group
  var my_group = root.customVariables.getItemWithName(group_name);
  if (my_group.name != group_name) {
    // build a new group
    my_group = root.customVariables.addItem(group_name);
    my_group.setName(group_nice_name);
  }
  return my_group;
}

/**
 * Set or create then set the custom variable value
 * @param {int} page_id 
 * @param {int} exec_id 
 * @param {int} value 
 * @param {string} type 
 * @param {string} item_nice_name 
 */
function setCustomVariablesValue(page_id, exec_id, value, type, item_nice_name) {
  // get the group
  var my_group = getCustomVariablesGroupByPageExec(page_id, exec_id);
  // define the item type
  var item_name = type;
  var item_type = "Int";
  var int_max = 100;

  if (["Go", "Stop", "Resume", "Off"].contains(type)) {
    item_type = "Bool";
  }
  // build some names
  var my_value = {};
  var my_value_name = "exec"+ page_id+ "_"+exec_id+ item_name;
  var my_value_nice_name = "Exec "+ page_id+ "_"+ exec_id+ " "+ item_nice_name;

  var my_value_item = my_group.variables.getItemWithName(my_value_name);
  if (my_value_item.name != my_value_name) {
    // create if not exist
    my_value_item = my_group.variables.addItem(item_type+ " Parameter");
    my_value = my_value_item.getChild(my_value_item.name);
    my_value.setName(my_value_nice_name);

    if (["CueMsb", "CueLsb"].contains(type)) {
      int_max = 999;
    }
    if (["Hour", "Minute", "second"].contains(type)) {
      int_max = 60;
    }
    if (!["Go", "Stop", "Resume", "Off"].contains(type)) {
      my_value.setRange(0,int_max);
    }
  }
  else {
    my_value = my_value_item.getChild(my_value_item.name);
  }
  if (["Go", "Stop", "Resume", "Off"].contains(type)) {
    my_value.set(true);
    my_value.set(false);
  }
  else {
    my_value.set(value);
  }
  my_group.variables.reorderItems();
}

/**
 * Generate some custom variables values
 * @param {int} qty 
 * @param {int} page_id 
 * @param {int} exec_id 
 */
function generateExecs(qty, page_id, exec_id) {
  if (qty < 1) return;
  var new_item = {};
  var new_item_value = {};
  for (i=0; i<qty; i++) {
    // add go
    setCustomVariablesValue(page_id, (exec_id+i), false, "Go", "Go");
    // add stop
    setCustomVariablesValue(page_id, (exec_id+i), false, "Stop", "Stop");
    // add resume
    setCustomVariablesValue(page_id, (exec_id+i), false, "Resume", "Resume");
    // add off
    setCustomVariablesValue(page_id, (exec_id+i), false, "Off", "Off");
    // add fader level
    setCustomVariablesValue(page_id, (exec_id+i), 0, "FaderLevel", "Fader Level");
    // add cue msb
    setCustomVariablesValue(page_id, (exec_id+i), 0, "CueMsb", "Cue Msb");
    // add cue lsb
    setCustomVariablesValue(page_id, (exec_id+i), 0, "CueLsb", "Cue Lsb");
  }
}

/**
 * Parse received data and fill parameters
 * @param {array} data (sysex data received knowing that the first (f0) and the last one (f7) are truncated)
 */
function autoAdd(data) {
  // go
  if (data[4] == 1) {
    setCustomVariablesValue(smv.page.id.value, smv.exec.id.value, null, "Go", "Go");
    setCustomVariablesValue(smv.page.id.value, smv.exec.id.value, smv.cue.msb.value, "CueMsb", "Cue Msb");
    setCustomVariablesValue(smv.page.id.value, smv.exec.id.value, smv.cue.lsb.value, "CueLsb", "Cue Lsb");
  }
  // stop
  if (data[4] == 2) {
    setCustomVariablesValue(smv.page.id.int, smv.exec.id.int, null, "Stop", "Stop");
  }
  // resume
  if (data[4] == 3) {
    setCustomVariablesValue(smv.page.id.int, smv.exec.id.int, null, "Resume", "Resume");
  }
  // set
  if (data[4] == 6) {
    setCustomVariablesValue(smv.page.id.int, smv.exec.id.int, smv.fader.level.int, "FaderLevel", "Fader Level");
  }
  // off
  if (data[4] == 10 || data[4] == 11) {
    setCustomVariablesValue(smv.page.id.int, smv.exec.id.int, null, "Off", "Off");
    setCustomVariablesValue(smv.page.id.value, smv.exec.id.value, 0, "CueMsb", "Cue Msb");
    setCustomVariablesValue(smv.page.id.value, smv.exec.id.value, 0, "CueLsb", "Cue Lsb");
  }

  // disable auto add if necessary
  if (listen == "autoadd_single") {
    local.parameters.moduleParameters.listen.set("nothing");
  }
}

/* **********************
      Send callbacks
  *********************** */

/**
 * Add the device infos to the sysex output
 * @returns {array} The sysex values computed as an array
 */
function setDeviceSysex() {
  var sysex = [];

  // realtime
  sysex[0] = 127;

  // device type
  var device_type = local.parameters.deviceParameters.sendTo.get();
  if (device_type == "all") {
    sysex[1] = 127;
  }
  else if (device_type == "group") {
    sysex[1] = local.parameters.deviceParameters.group.get()+ 111;
  }
  else if (device_type == "device") {
    sysex[1] = local.parameters.deviceParameters.device.get();
  }

  // set msc
  sysex[2] = 2;

  // command format
  var command_format = local.parameters.deviceParameters.commandFormat.get();
  if (command_format === "all") {
    sysex[3] = 127;
  }
  else if (command_format === "general_lighting") {
    sysex[3] = 2;
  }
  else if (command_format === "moving_lights") {
    sysex[3] = 1;
  }

  return sysex;
}

/**
 * Add the cue infos to the sysex output
 * @param {array} sysex 
 * @param {int} cue_msb 
 * @param {int} cue_lsb 
 * @returns {array} The sysex values computed as an array
 */
function addCueToSysex(sysex, cue_msb, cue_lsb) {
  // convert cue msb to a string
  var cue_msb_string = cue_msb+ "";
  // separate cue to items
  var cue_msb_items = cue_msb_string.split('');
  // generate sysex for each item
  for (i=0; i<cue_msb_items.length; i++) {
    // convert to hex and then to integer
    sysex[sysex.length] = charToInt(cue_msb_items[i]);
  }

  // add a dot
  sysex[sysex.length] = 46;

  // convert cue msb to a string
  var cue_lsb_string = cue_lsb+ "";
  // separate cue to items
  var cue_lsb_items = cue_lsb_string.split('');
  // generate sysex for each item
  var cue_lsb_items_length = cue_lsb_items.length;
  for (i=0; i<cue_lsb_items_length; i++) {
    // convert to hex and then to integer
    sysex[sysex.length] = charToInt(cue_lsb_items[i]);
  }

  // add zero if needed
  if (cue_lsb_items_length < 3) {
    sysex[sysex.length] = 48;
  }
  // add zero if needed
  if (cue_lsb_items_length < 2) {
    sysex[sysex.length] = 48;
  }

  return sysex;
}

/**
 * Add the page and exec infos to the sysex output
 * @param {array} sysex 
 * @param {int} page_id 
 * @param {int} exec_id 
 * @returns {array} The sysex values computed as an array
 */
function addPageAndExecToSysex(sysex, page_id, exec_id) {
  var exec_offset = (local.parameters.deviceParameters.deviceType.get() == "grandma")? 0:1;
  exec_id = exec_id + exec_offset;
  // convert the executor to string
  var exec_id_string = exec_id+ "";
  // separate to items
  var exec_id_items = exec_id_string.split('');
  // convert to hex and then to integer
  for (i=0; i<exec_id_items.length; i++) {
    sysex[sysex.length] = charToInt(exec_id_items[i]);
  }

  // compute the separator (dot or space)
  var separator = 46;
  if (local.parameters.deviceParameters.exec.get() == "exec_space_page") {
    // the doc says 32 but the machine returns 0
    //separator = 32;
    separator = 0;
  }
  sysex[sysex.length] = separator;

  // convert the page to string
  var page_id_string = page_id+ "";
  // separate to items
  var page_id_items = page_id_string.split('');
  // convert to hex and then to integer
  for (i=0; i<page_id_items.length; i++) {
    sysex[sysex.length] = charToInt(page_id_items[i]);
  }

  return sysex;
}

/**
 * Send a full sysex "Go" command
 * @param {int} cue_msb 
 * @param {int} cue_lsb 
 * @param {int} page_id 
 * @param {int} exec_id 
 * @param {boolean} use_time 
 * @param {int} time_hour 
 * @param {int} time_minute 
 * @param {int} time_second 
 */
function sendGo(cue_msb, cue_lsb, page_id, exec_id, use_time, time_hour, time_minute, time_second) {
  var sysex = setDeviceSysex();

  if (use_time) {
    // command (timed go = 4)
    sysex[sysex.length] = 4;
    // add time
    sysex[sysex.length] = time_hour;
    sysex[sysex.length] = time_minute;
    sysex[sysex.length] = time_second;
    // add the separator
    sysex[sysex.length] = 0;
  }
  else {
    // command (go = 1)
    sysex[sysex.length] = 1;
  }

  sysex = addCueToSysex(sysex, cue_msb, cue_lsb);

  // set page and exec if needed
  if (local.parameters.deviceParameters.exec.get() !== "default_only") {
    // add the separator
    sysex[sysex.length] = 0;
    // add page and exec
    sysex = addPageAndExecToSysex(sysex, page_id, exec_id);
  }

  // faya !!
  if (local.parameters.moduleParameters.logSysex.get())logSysex(sysex);
  local.sendSysex(sysex);
}

/**
 * Send a full sysex "Stop" or "Resume" command
 * @param {boolean} stop_or_resume 
 * @param {int} page_id 
 * @param {int} exec_id 
 */
function sendStopResume(stop_or_resume, page_id, exec_id) {
  var sysex = setDeviceSysex();

  if (stop_or_resume) {
    // command (stop = 2)
    sysex[sysex.length] = 2;
  }
  else {
    // command (resume = 3)
    sysex[sysex.length] = 3;
  }

  // add page and exec if needed
  if (local.parameters.deviceParameters.exec.get() !== "default_only") {
    // add cue zero
    sysex[sysex.length] = 48;
    sysex[sysex.length] = 46;
    sysex[sysex.length] = 48;
    sysex[sysex.length] = 48;
    sysex[sysex.length] = 48;
    // add the separator
    sysex[sysex.length] = 0;
    // add page and exec
    sysex = addPageAndExecToSysex(sysex, page_id, exec_id);
  }

  // faya !!
  if (local.parameters.moduleParameters.logSysex.get())logSysex(sysex);
  local.sendSysex(sysex);
}

/**
 * Send a full sysex "Set" command
 * @param {int} fader_level
 * @param {int} page_id 
 * @param {int} exec_id 
 * @param {boolean} use_time 
 * @param {int} time_hour 
 * @param {int} time_minute 
 * @param {int} time_second 
 */
function sendSet(fader_level, page_id, exec_id, use_time, time_hour, time_minute, time_second) {
  var exec_offset = (local.parameters.deviceParameters.deviceType.get() == "grandma")? 1:0;
  var sysex = setDeviceSysex();

  // command (set = 6)
  sysex[4] = 6;

  // set page and exec if needed
  // it looks like the desk is not interpreting default_only
  // see : http://www.ma-share.net/forum/read.php?6,67568,67568#msg-67568
  var offset = 0;
  //if (local.parameters.deviceParameters.exec.get() !== "default_only") {
    offset = 2;
    sysex[5] = exec_id-exec_offset;
    sysex[6] = page_id;
  //}

  // set the fader value
  var coarse_fine = faderLevelToCoarseFine(fader_level);
  sysex[5+ offset] = coarse_fine[1];
  sysex[6+ offset] = coarse_fine[0];

  // add time if needed
  if (use_time) {
    // add time
    sysex[sysex.length] = time_hour;
    sysex[sysex.length] = time_minute;
    sysex[sysex.length] = time_second;
    // add frames
    sysex[sysex.length] = 0;
    // add fractions
    sysex[sysex.length] = 0;
  }
  // faya !!
  if (local.parameters.moduleParameters.logSysex.get())logSysex(sysex);
  local.sendSysex(sysex);
}

/**
 * Send a full sysex "Fire" command
 * @param {int} macro_id 
 */
function sendFire(macro_id) {
  var sysex = setDeviceSysex();

  // command (fire = 7)
  sysex[4] = 7;

  // macro id
  sysex[5] = macro_id;

  // faya !!
  if (local.parameters.moduleParameters.logSysex.get())logSysex(sysex);
  local.sendSysex(sysex);
}

/**
 * Send a full sysex "Go off" command
 * @param {int} cue_msb 
 * @param {int} cue_lsb 
 * @param {int} page_id 
 * @param {int} exec_id 
 */
function sendGoOff(cue_msb, cue_lsb, page_id, exec_id) {
  var sysex = setDeviceSysex();

  // command (go off = 11)
  // command (off = 10)
  sysex[4] = 11;

  sysex = addCueToSysex(sysex, cue_msb, cue_lsb);

  // set page and exec if needed
  if (local.parameters.deviceParameters.exec.get() !== "default_only") {
    // add the separator
    sysex[sysex.length] = 0;
    // add page and exec
    sysex = addPageAndExecToSysex(sysex, page_id, exec_id);
  }

  // faya !!
  if (local.parameters.moduleParameters.logSysex.get())logSysex(sysex);
  local.sendSysex(sysex);
}

/* **********************
    Chataigne callbacks
  *********************** */

/**
 * Chataigne event triggered when receiving sysex data
 * @param {array} data (sysex data received)
 */
function sysExEvent(data) {
  resetSmv();
  parseSysex(data);
  if (local.parameters.moduleParameters.logSysex.get())logInputSysex(data);
  var listen = local.parameters.moduleParameters.listen.get();
  if (listen != "nothing" && listen != "")autoAdd(data, listen);
}

/**
 * Chataigne method runned when the script is loaded
 */
function init() {
  // Ben told me that is a wrong id to delete containers so i will just collapse them first
  // local.values.removeContainer("infos");
  // local.values.removeContainer("tempo");
  // local.values.removeContainer("mtc");
  local.values.getChild("infos").setCollapsed(true);
  local.values.getChild("tempo").setCollapsed(true);
  local.values.getChild("mtc").setCollapsed(true);
}
