<template>
  <div >
    <div align="center">
      <div class="centerbox-main typewriter">
        <h1>Voice Analyzer</h1>
        <router-link v-shortkey="['ctrl', 'alt', 'o']" @shortkey.native="theAction()" tag="button" to="/play" class="btn btn-danger btn-lg">Start</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "jquery";
import "popper.js";
export default {
  methods: {
    play(){
      this.$route.push('/play')
    },
    theAction(){
      this.$router.push('/play');
    }
  },
};
</script>

<style scoped>
.centerbox-main {
  border-radius: 25px;
  background-color: #424242;
  color:aliceblue;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  overflow: auto;
  padding: 4%;
}
button{
  margin: 5%;
}
.typewriter h1 {
  overflow: hidden;
  border-right: .15em solid orange; 
  white-space: nowrap; 
  margin: 0 auto; 
  letter-spacing: .20em; 
  animation: 
    typing 3.5s steps(26, end),
    blink-caret .75s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style>