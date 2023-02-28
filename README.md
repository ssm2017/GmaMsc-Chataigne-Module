NOTE : This module will not be updated : you should better use : [MidiMSC-Chataigne-Module](https://github.com/ssm2017/MidiMSC-Chataigne-module)


# Chataigne grandma2 msc
This script is a custom hardware module to use with the software [Chataigne](http://benjamin.kuperberg.fr/chataigne) and the lighting desk [GrandMa2](https://www.malighting.com/product-archive/products/grandma2/) or [Dot2](https://www.malighting.com/product-archive/products/dot2/).

This script is using midi msc commands.

[Here is a link to the GrandMa2 msc doc](https://help2.malighting.com/Page/grandMA2/remote_control_msc/en/3.9).

This module is getting values from the desk and can send values to the desk to automate some processes.

## How to use this module ?
* Configure the msc in your desk (see the doc link above)
* Copy the module folder in the Chataigne's Documents folder (c:\Users\youruser\Documents\Chataigne\modules) or in a "module" subfolder where your .noisette file is located.
* Assign the midi in and midi out port
* Configure the "Device parameters" to reflect your desk ones
* In the "Module parameters", select if you want to see the sysex log (the log must be activated for the module script)

### Listen to messages from the desk
* In the "Module parameters", select an option in the "Listen" list :
  * None : do not listen anything
  * Listen : just listen the messages and update the existing values without creating new ones
  * AASingle : Auto Add the first value listened from the desk to the "Custom variables" and then set this param to "None"
  * AAAll : Auto Add All the values listened from the desk to the "Custom variables"
* Once your values are captured, you can set "Listen" to "listen" to update the values.

### Send messages to the desk
To send messages, you can use one of the integrated callbacks.

### Generate Execs
Generate Execs targets in custom vars groups so also in the module values if not exist.
If you ask to generate 10 execs starting at page 1 exec 1, it will create :
10 custom variables groups, each one containing :
fader level
go
stop
resume
off
cue msb
cue lsb
and the same inside the module's value container.

### Fill Custom Variables Group
Generate value targets in the same group and the same kind.
if you ask to generate 10 fader levels starting at page 1 exec 1 in the group named "as you like", it will create only one custom variables group containing 10 fader levels.
And on the module's value container, they will be created too if not exist but organized in page and exec id containers.
