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
 
#### 1. Configuring ALSA

Alsa (Advanced Linux Sound Architecture) is low-level *driver* for linux audio devices

First step would be to plug-in our devices and configure

Raspberry PI has Jack output by default, so we only need to plug our microphone in.

    > alsamixer
    
unmute all devices with "m", set all levels to average value


Test that microphone works

    > arecord filename.wav
    
Test that speakers work

    > aplay filename.wav
    

**If the tests not passed, its best to contact developer right here**

*On Raspbian Alsa/Jack config is not saved from QJackCtl UI, so Jack will
always try to capture audio from built in audio card*

Disable build-in audio card
            
    > sed -i -e 's/dtparam=audio=on/dtparam=audio=off/g' /boot/config.txt

Yet still jackd won't work, since jackd v2 is bundled, and it requires DBus/Desktop
and we should install jackd v1
 
    > apt remove jackd
    > apt install jackd1
   
Test
 
    > jacd -d alsa
    
*it should not do any output, just should not crash*

#### 2. Install code

To install the code you need Git. Git is installed on RPI by default. So.

* Get root access 

        > sudo bash

* Navigate to root
    
        > cd /

    *we use root location for the sake of simplicity* 

* Clone the repo

        > git clone https://github.com/kailight/audiocare.git
    
  This will put the script into /audiocare
  
* Chmod the repo to allow scripts execution

        > cd /audiocare
        
        > chmod -R 777 .

* Automatically link c libraries on start

    I have no idea why on RPI it produces that libaubio.so
    file we gotta carry along with us around, and link it every time
    however for now just do
    
        > echo "LD_LIBRARY_PATH=/audiocare/c" >> /root/.profile   
   
* Add jack_connect to path as well

        > echo path=$PATH:/c    
   
#### 3. Test C script with Jackd        

    > reboot

    > /audiocare/c/audiocare
        
Should output funny numbers, however all values but MFCC gonna be 0
- because jack ports aren't connected, so no capture from MIC

To connect ports we should open **another** terminal

In Windows, need to click RPI SSH session putty window top bar with right mouse button and 
choose *duplicate session* from menu

While audiocare script works in terminal#1, in terminal#2 run

    > /usr/bin/jack_connect system:capture_1 aubio:in_1

**It works!** *if it doesn't, contact dev to investigate why*


#### 4. Install node

We use nodejs wrapper script to run the main C script. 

By default an older version of node is bundled on Raspbian Stretch.

We need newer version of node (8+) to run the node script to control the C scipt...

* Remove bundled node
 
        > apt remove nodejs
    
* Install node (tested on node v8)

        > curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        > sudo apt-get install -y nodejs
    
* Install npm packages          
    
        > cd /audiocare
        > npm install
        
* Test server

        > cd /audiocare
        > mkdir data
        > mkdir configuration
        > ./server
        
   Use **browser** to access RPI by WiFi
    
   Use RPI IP address to access from other PC over local network (e.g. same address as for SSH access) 
   or by 127.0.0.1 from RPI desktop                 
    
#### Run the node wrapper script

      > ./start
    
If no config file is found, the node script will ask you to configure itself    
    
**It works!** *if it doesn't, contact dev to investigate why*



## Updating

After installation is complete and script is working use

    > /audiocare/update
    
To update the code from GIT repo