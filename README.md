# AudioCare

## v0.0.1

### This Repository contains only the compiled C script

Contact developer for source code

### About 

Does magics

### Installation

*Prerequisites*

* Raspberry PI (only tested on 3B)
* Raspbian OS (only tested on Stretch)
* Internet access (easy to configure it from UI)

*In future, if you gonna setup completely headless monitor, you can pre-configure internet
 without UI or monitor by modifying text on SD card, ask me how* 
 
#### Configuring ALSA

Alsa is Advanced Linux Sound Architecture

It is low-level *driver* for linux audio devices

First step would be to plug-in our devices and configure

Raspberry PI has Jack output by default, so we only need to plug our microphone in.

    > alsamixer
    
unmute all devices with "m", set all levels to average value

    > aplay filename.wav
    
to test that speakers work

    > arecord filename.wav
    
to test that microphone work

**If the tests not passed, its best to contact developer right here**

#### Code

To install the code you need Git, it is installed on RPI by default. So.

Start CLI (terminal)

* Get root access 

    > sudo bash

* Navigate to root
    
    > cd /

    *we use root location for the sake of simplicity* 

* Clone the repo

    > git clone https://github.com/kailight/audiocare.git
    
  This will put the script into /audiocare
  
* Chmod the repo to allow scripts execution  
  
#### Configure Jack

Jack is more advanced (than Alsa) tool for sound management

In this project we use it to connect microphone with our script

It is much easier to configure the jack from UI 

However you need to run 

    > qjackctl
    
from the terminal

# !!!to be continued

#### Test the script

    > /audiocare/audiocare
    
**It works!** *ok it doesn't, contact dev to investigate why*

#### Install node

We use nodejs wrapper script to run the C script 

By default an older version of node is bundled on Raspbian Stretch

We need newer version of node (8+) to run the node script to control the C scipt...

* Remove bundled node
 
    \> ...
    
* Install latest stable node    
    
    \> ...
    
* Install latest npm 

    \> ...
    
* Install npm packages          
    
    \> cd /audiocare
    \> npm install
    
#### Run the node wrapper script

    \> ./start
    
If no config file is found, the node script will ask you to configure itself    
    
**It works!** *ok it doesn't, contact dev to investigate why*    