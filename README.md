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

First step would be to plug-in our USB microphone/audiocard and configure

    > alsamixer

unmute all controls with "m", set all levels to average value

*On Raspbian Alsa/Jack config is not saved from QJackCtl UI, so Jack will
always try to capture audio from built in audio card*

For now only way I found to make it play nice is

* Disable built-in audio card

      > sed -i -e 's/dtparam=audio=on/dtparam=audio=off/g' /boot/config.txt

* Set usb card to use hw:0 slot 

      > echo "options snd-usb-audio index=0" >> /etc/modprobe.d/alsa-base.conf
    
* Reboot

      > reboot
           
* Check that microphone is card0
        
      > arecord -l
      
  *should read `card 0: **Your Microphone Name**, device 0*`  

   **If this is not true, contact developer right here**
      
* (optional) test that microphone works

        > arecord filename.wav
      
  *this should record a wav file to disk*

* (optional) Test that speakers work
    
      > aplay filename.wav


#### 1.5 Configuring Jack

We have 2 options, use Jack1 or Jack2. 

##### 1.5.1 Install jack1 instead

This way downside is I couldn't find way to change default driver properties

    > apt remove jackd
    > apt install jackd1

##### 1.5.2 Configure default jack2
    
Running jackd2 allows us to control properties with jack_control
    
First we save usage of dbus without Desktop 
    
    > echo "export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/dbus/system_bus_socket" >> ~/.bashrc
    
Check    
    
    > nano ~/.bashrc
    
Allow user to use audio     
    
    > echo "<policy user="pi">\n<allow own="org.freedesktop.ReserveDevice1.Audio0"/>\n</policy>" >> /etc/dbus-1/system.conf

Check    
    
    > nano /etc/dbus-1/system.conf
    
Test

    > reboot
    > jackd -d alsa
    
If it doesn't work with root access drop access with 

    > exit
    > jackd -d alsa     

*test should not do any output, but jackd should not crash*

#### 2. Install code

To install the code you need Git. Git is bundled with RPI.

* Get root access

        > sudo bash

* Navigate to root

        > cd /

    *we use root location for the sake of simplicity*

* Clone the repo

        > git clone https://github.com/kailight/audiocare.git

    *This will put the script into /audiocare*

* Chmod the repo to allow scripts execution

        > cd /audiocare

        > chmod -R 777 .

* Automatically link c libraries on startup

    On RPI C compiler produces libaubio.so
    we gotta carry along with it, so link it on startup

        > echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/audiocare/c" >> ~/.bashrc
        
* Reboot
    
      > reboot        
        
        
        
#### 3. Test C script with Jackd

    > cd /audiocare/c     
    > ./audiocare

Should output funny numbers, however values but MFCC gonna be 0
- because jack ports aren't connected, so no capture from MIC

To connect ports we should open **another** terminal

In Windows, need to click RPI SSH session putty window top bar with right mouse button and
choose *duplicate session* from menu

While audiocare script works in terminal#1, in terminal#2 run

    > /usr/bin/jack_connect system:capture_1 aubio:in_1

(optional) Using jack2 we also can pre-launch server and manually configure it, 
for that we need third ssh window. We can also launch the server on startup.
    
    > jack_control start
    > jack_control ds alsa
    > jack_control dps device hw:0
    > jack_control dps rate 48000
    > jack_control dps period 4097

To exit jack server

    > jack_control exit

**It works!** *if it doesn't, contact dev to investigate why*


#### 4. Install node

We use nodejs wrapper script to run the main C script.

By default an old 4.x version of node is bundled on Raspbian Stretch.

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
        > ./server

   Use **browser** to access RPI by WiFi

   Use RPI IP address to access UI from other PC (e.g. same address as for SSH access)
   or use 127.0.0.1 to access UI from RPI desktop

#### Run the node wrapper script

      > cd /audiocare  
      > ./start

If no config file is found, the node script will ask you to configure itself

**It works!** *if it doesn't, contact dev to investigate why*


## Updating

After installation is complete and script is working use

    > cd /audiocare
    > ./update

To update the code from GIT repo