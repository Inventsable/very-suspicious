<template>
    <v-container class="centerContainer">
        <v-card width="300">
            <v-card-title
            class="title grey lighten-2"
            primary-title
            >
                <v-icon style="color: rgba(0,0,0,0.54);" large>{{orientation}}</v-icon>
                <span class="ml-3" style="color: rgba(0,0,0,0.54);">{{device}}</span>
            </v-card-title>

            <v-card-text>
                <span>{{screenSize}}</span>
                <br>
                <span>{{'OS: ' + os}}</span>
                <br>
                <span>{{'Browser: ' + browser}}</span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer v-if="!sent"></v-spacer>
                <v-btn
                    v-if="!sent"
                    color="primary"
                    flat
                    @click="sendData"
                >
                    Submit
                </v-btn>
                <span
                    v-if="sent && !done"
                    class="text-uppercase grey--text center"
                    style="height: 36px">
                    {{`Turn your device to ${this.isPortrait ? 'Landscape' : 'Portrait'}`}}
                </span>
                <span
                    v-if="done"
                    class="text-uppercase grey--text center"
                    style="height: 36px">
                    all done
                    <v-icon class="pb-1 pl-3">thumb_up</v-icon>
                </span>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'screen',
    data: () => ({
        done: false,
        msg: 'Hello world',
        device: null,
        sent: false,
        sentMsg: {
            landscape: null,
            portrait: null,
        },
        browser: null,
        os: null,
        screenX: null,
        screenY: null,
        // orientation: null,
        isMobileDevice: null,
        isPortrait: null,
    }),
    computed: {
        screenSize() {
            return `${this.screenX}px by ${this.screenY}px`
        },
        orientation() {
            if (this.isMobileDevice) {
                return (this.isPortrait) ? 'stay_current_portrait' : 'stay_current_landscape';
            } else {
                return 'desktop_windows'
            }
        },
    },
    mounted() {
        console.log('Hello world');
        this.checkSize();
        // console.log(this.$route.name)
        window.addEventListener("resize", this.checkSize);
        window.addEventListener("orientationchange", this.checkSize);
        // this.getBrowser();
        // this.os = this.getOS();
    },
    methods: {
        // getBrowser() {
        //     const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        //     const isFirefox = typeof InstallTrigger !== 'undefined';
        //     const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        //     const isIE = false || !!document.documentMode;
        //     const isEdge = !isIE && !!window.StyleMedia;
        //     const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        //     const isBlink = (isChrome || isOpera) && !!window.CSS;
        //     if (isOpera)
        //         this.browser = 'Opera'
        //     if (isFirefox)
        //         this.browser = 'Firefox'
        //     if (isSafari)
        //         this.browser = 'Safari'
        //     if (isIE)
        //         this.browser = 'IE'
        //     if (isEdge)
        //         this.browser = 'Edge'
        //     if (isChrome)
        //         this.browser = 'Chrome'
        //     if (isBlink)
        //         this.browser = 'Chrome'
        // },
        // getOS() {
        //     let OSName = "Unknown";
        //     if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) OSName="Windows 10";
        //     if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
        //     if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
        //     if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
        //     if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
        //     if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows 2000";
        //     if (window.navigator.userAgent.indexOf("Mac")            != -1) OSName="Mac/iOS";
        //     if (window.navigator.userAgent.indexOf("X11")            != -1) OSName="UNIX";
        //     if (window.navigator.userAgent.indexOf("Linux")          != -1) OSName="Linux";
        //     return OSName;
        // },
        sendData() {
            this.sentMsg[`${this.isPortrait ? 'portrait' : 'landscape'}`] = [this.screenX, this.screenY];
            this.sent = true;
            
            if (this.sentMsg.landscape && this.sentMsg.portrait) {
                let msg = {
                    landscape: this.sentMsg.landscape,
                    portrait: this.sentMsg.portrait,
                    device: this.device,
                    // browser: this.browser,
                    // os: this.os,
                }
                // console.log(msg)
                db.collection('device').add(msg)
                this.done = true;
            }
        },
        checkSize() {
            const doc = document.documentElement;
            this.screenX = doc.clientWidth;
            this.screenY = doc.clientHeight;
            let mobilex = [640, 360, 375, 667, 568, 320, 812, 736, 823];
            let mobiley = [280, 560, 551, 325, 270, 452, 375, 414, 411];
            let devices = ['Galaxy S5', 'Galaxy S5', 'iPhone 6/7/8', 'iPhone 6/7/8', 'iPhone SE', 'iPhone SE', 'iPhone X', 'iPhone 6/7/8+', 'Pixel 2 XL'];
            let match = false;
            for (let i = 0; i < mobilex.length; i++) {
                let x = mobilex[i], y = mobiley[i]
                if (screen.orientation.angle !== 0) {
                    if (this.sentMsg.landscape)
                        this.sent = true;
                    else
                        this.sent = false;
                    if (doc.clientWidth == x) {
                        match = true;
                        this.isMobileDevice = true;
                        this.isPortrait = false;
                        this.device = devices[i];
                    }
                } else {
                    if (this.sentMsg.portrait)
                        this.sent = true;
                    else
                        this.sent = false;
                    if (doc.clientWidth == y) {
                        match = true;
                        this.isMobileDevice = true;
                        this.isPortrait = true;
                        this.device = devices[i];
                    }
                }
            }
            if (!match) {
                this.altKeyboard = false;
                if (doc.clientWidth < 800) {
                    if (doc.clientWidth > doc.clientHeight)
                        this.isPortrait = false;
                    else
                        this.isPortrait = true;
                    this.isMobileDevice = true;
                    this.device = 'Unknown'
                } else {
                    this.isMobileDevice = false;
                    this.device = 'Desktop';
                    this.isPortrait = true;
                }
            }

        },
    }
}
</script>

<style>
.centerContainer {
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>

