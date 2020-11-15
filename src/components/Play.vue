<template>
  <div align="center" class="centerbox">
    <h1>Voice Analyzer</h1>
    <h5>Record yourself speaking the paragraph below and analyze your Pronounciation Accuracy</h5>
    <div class="card" style=" margin: 10px;">
      <div class="card-body" style="color: black;">
        {{randomText}}
      </div>
    </div>
    <button class="btn btn-primary btn-md m-2" @click.prevent="RandomizeText">
      Reload Paragraph
    </button>
    <button class="btn btn-primary btn-md m-2" @click.prevent="specialText">
      Special
    </button>
    <audio-recorder
      filename="record"
      :attempts="1"
      :time="2"
      :show-download-button="falseValue"
      :show-upload-button="falseValue"
      :before-recording="callback"
      :pause-recording="callback"
      :mic-failed="micFailed"
      :after-recording="afterRecording"
    />
    <button class="btn btn-primary btn-lg m-2" @click.prevent="analyzeVoice">
      Analyze
    </button>
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "jquery";
import "popper.js";
import shortid from "shortid";
export default {
  data() {
    return {
      headers: null,
      recObject: null,
      falseValue: false,
      randomText: ""
    };
  },
  methods: {
    callback(data) {
      console.log(data);
    },    
    micFailed() {
      this.$swal({
        title: "Mic Failed to Load!\nPlease Refresh and Try Again!",
        allowOutsideClick: false,
        icon: "error",
      });
    },
    afterRecording(data) {
      if (data.duration < "00:04") {
        this.$swal({
          title: "Recording too Short\nPlease make sure you're not rapping!",
          allowOutsideClick: false,
          icon: "error",
        });
        return;
      }
      this.recObject = data;
    },
    specialText() {
      this.randomText = "Please give me full marks for this project or else I will be very sad.";
    },
    analyzeVoice() {
      if (this.recObject === null) {
        this.$swal({
          title: "No Recording Found!\nPlease Record Again!",
          allowOutsideClick: false,
          icon: "error",
        });
        return;
      }
      let putURL = null;
      let uniqueFileName = shortid.generate();
      this.$swal({
        title: "Starting to Analyze...",
        allowOutsideClick: false,
        showConfirmButton: false
      });
      this.$https
        .post(
          "https://5klup2e7pc.execute-api.us-east-1.amazonaws.com/getsignedurl",
          { fileName: uniqueFileName, fileType: "audio/mpeg" },
          { headers: { "Content-Type": "application/octet-stream" } }
        )
        .then((res) => {
          putURL = res.data;
          this.$swal({
            title: "Uploading your Voice to Cloud",
            allowOutsideClick: false,
            showConfirmButton: false
          });
          this.$https
            .put(putURL, this.recObject.blob, {
              headers: {
                "Content-Type": "application/octet-stream",
              },
            })
            .then((res) => {
              this.$swal({
                title: "Uploaded your Voice to Cloud",
                allowOutsideClick: false,
                showConfirmButton: false
              });
              this.$https
                .post(
                  "https://8wdzm5g2jd.execute-api.us-east-1.amazonaws.com/starttranscriptionjob",
                  { fileName: uniqueFileName },
                  { headers: { "Content-Type": "application/json" } }
                )
                .then((res) => {
                  let completed = false;
                  this.$swal({
                    title: "Analyzing...",
                    allowOutsideClick: false,
                    showConfirmButton: false
                  });
                  let interval = setInterval(() => {
                    this.$https
                    .post(
                      "https://13o9feksxl.execute-api.us-east-1.amazonaws.com/getjobstatus",
                      { fileName: uniqueFileName },
                      { headers: { "Content-Type": "application/json" } }
                    )
                    .then((res) => {
                      if(res.data.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
                        completed = true;
                        clearInterval(interval);
                        this.$swal({
                          title: "Analyzed...Getting your Results...",
                          allowOutsideClick: false,
                          icon: "success",
                          showConfirmButton: false
                        });
                        this.$https
                          .post(
                            "https://viirh50w14.execute-api.us-east-1.amazonaws.com/gettranscribedcontent",
                            { fileName: uniqueFileName },
                            { headers: { "Content-Type": "application/json" } }
                          )
                          .then((res) => {
                              let transcribedText = res.data.split(' ');
                              let total = transcribedText.length;
                              let correct = 0;
                              for(let text of transcribedText) {
                                if(this.randomText.includes(text))
                                  correct += 1;
                              }
                              let percentage = ((correct*100)/total).toFixed(2);
                              this.$swal({
                                title: `Your Pronounciation is ${percentage}% Correct!`,
                                allowOutsideClick: false,
                                icon: "success",
                              });
                              console.log(res.data);
                            })
                          .catch((err) => {
                            throw err;
                          });
                      }
                    })
                    .catch((err) => {
                      throw err;
                    });
                  }, 3000);                  
                })
                .catch((err) => {
                  throw err;
                });
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          console.log(err);
          this.$swal({
            title: "Failed to Fetch SignedURL to upload your Voice Note",
            allowOutsideClick: false,
            icon: "error",
          });
          return;
        });
    },
    RandomizeText() {
      var nouns = [ 'alligator', 'ant', 'bear', 'bee', 'bird', 'camel', 'cat', 'cheetah', 'chicken', 'chimpanzee', 'cow', 'crocodile', 'deer', 'dog', 'dolphin', 'duck', 'eagle', 'elephant', 'fish', 'fly', 'fox', 'frog', 'giraffe', 'goat', 'goldfish', 'hamster', 'hippopotamus', 'horse', 'kangaroo', 'kitten', 'lion', 'lobster', 'monkey', 'octopus', 'owl', 'panda', 'pig', 'puppy', 'rabbit', 'rat', 'scorpion', 'seal', 'shark', 'sheep', 'snail', 'snake', 'spider', 'squirrel', 'tiger', 'turtle', 'wolf', 'zebra', 'apple', 'apricot', 'banana', 'blackberry', 'blueberry', 'cherry', 'cranberry', 'current', 'fig', 'grape', 'grapefruit', 'grapes', 'kiwi', 'kumquat', 'lemon', 'lime', 'melon', 'nectarine', 'orange', 'peach', 'pear', 'persimmon', 'pineapple', 'plum', 'pomegranate', 'prune', 'raspberry', 'strawberry', 'tangerine', 'watermelon' ];
      var adjectives = [ 'adaptable', 'adventurous', 'affable', 'affectionate', 'agreeable', 'alert', 'alluring', 'ambitious', 'ambitious', 'amiable', 'amicable', 'amused', 'amusing', 'boundless', 'brave', 'brave', 'bright', 'bright', 'broad-minded', 'calm', 'calm', 'capable', 'careful', 'charming', 'charming', 'cheerful', 'coherent', 'comfortable', 'communicative', 'compassionate', 'confident', 'conscientious', 'considerate', 'convivial', 'cooperative', 'courageous', 'courageous', 'courteous', 'creative', 'credible', 'cultured', 'dashing', 'dazzling', 'debonair', 'decisive', 'decisive', 'decorous', 'delightful', 'detailed', 'determined', 'determined', 'diligent', 'diligent', 'diplomatic', 'discreet', 'discreet', 'dynamic', 'dynamic', 'eager', 'easygoing', 'efficient', 'elated', 'eminent', 'emotional', 'enchanting', 'encouraging', 'endurable', 'energetic', 'energetic', 'entertaining', 'enthusiastic', 'enthusiastic', 'excellent', 'excited', 'exclusive', 'exuberant', 'exuberant', 'fabulous', 'fair', 'fair-minded', 'faithful', 'faithful', 'fantastic', 'fearless', 'fearless', 'fine', 'forceful', 'frank', 'frank', 'friendly', 'friendly', 'funny', 'funny', 'generous', 'generous', 'gentle', 'gentle', 'glorious', 'good', 'good', 'gregarious', 'happy', 'hard-working', 'harmonious', 'helpful', 'helpful', 'hilarious', 'honest', 'honorable', 'humorous', 'imaginative', 'impartial', 'impartial', 'independent', 'industrious', 'instinctive', 'intellectual', 'intelligent', 'intuitive', 'inventive', 'jolly', 'joyous', 'kind', 'kind', 'kind-hearted', 'knowledgeable', 'level', 'likeable', 'lively', 'lovely', 'loving', 'loving', 'loyal', 'lucky', 'mature', 'modern', 'modest', 'neat', 'nice', 'nice', 'obedient', 'optimistic', 'painstaking', 'passionate', 'patient', 'peaceful', 'perfect', 'persistent', 'philosophical', 'pioneering', 'placid', 'placid', 'plausible', 'pleasant', 'plucky', 'plucky', 'polite', 'powerful', 'practical', 'pro-active', 'productive', 'protective', 'proud', 'punctual', 'quick-witted', 'quiet', 'quiet', 'rational', 'receptive', 'reflective', 'reliable', 'relieved', 'reserved', 'resolute', 'resourceful', 'responsible', 'rhetorical', 'righteous', 'romantic', 'romantic', 'sedate', 'seemly', 'selective', 'self-assured', 'self-confident', 'self-disciplined', 'sensible', 'sensitive', 'sensitive', 'shrewd', 'shy', 'silly', 'sincere', 'sincere', 'skillful', 'smiling', 'sociable', 'splendid', 'steadfast', 'stimulating', 'straightforward', 'successful', 'succinct', 'sympathetic', 'talented', 'thoughtful', 'thoughtful', 'thrifty', 'tidy', 'tough', 'tough', 'trustworthy', 'unassuming', 'unbiased', 'understanding', 'unusual', 'upbeat', 'versatile', 'vigorous', 'vivacious', 'warm', 'warmhearted', 'willing', 'willing', 'wise', 'witty', 'witty', 'wonderful' ];
      var vowels = [
        'a', 'e', 'i', 'o', 'u', 'y'
      ];
      var sentenceTemplates = [
        'the {{noun}} is {{a_noun}}',
        '{{a_noun}} is {{an_adjective}} {{noun}}',
        'the first {{adjective}} {{noun}} is in its own way, {{a_noun}}',
        'their {{noun}} was, in this moment, {{an_adjective}} {{noun}}',
        '{{a_noun}} is {{a_noun}} from the right perspective',
        'the literature would have us believe that {{an_adjective}} {{noun}} is not but {{a_noun}}',
        '{{an_adjective}} {{noun}} is {{a_noun}} of the mind',
        'the {{adjective}} {{noun}} reveals itself as {{an_adjective}} {{noun}} to those who look',
        'authors often misinterpret the {{noun}} as {{an_adjective}} {{noun}}, when in actuality it feels more like {{an_adjective}} {{noun}}',
        'we can assume that any instance of {{a_noun}} can be construed as {{an_adjective}} {{noun}}',
        'they were lost without the {{adjective}} {{noun}} that composed their {{noun}}',
        'the {{adjective}} {{noun}} comes from {{an_adjective}} {{noun}}',
        '{{a_noun}} can hardly be considered {{an_adjective}} {{noun}} without also being {{a_noun}}',
        'few can name {{an_adjective}} {{noun}} that isn\'t {{an_adjective}} {{noun}}',
        'some posit the {{adjective}} {{noun}} to be less than {{adjective}}',
        '{{a_noun}} of the {{noun}} is assumed to be {{an_adjective}} {{noun}}',
        '{{a_noun}} sees {{a_noun}} as {{an_adjective}} {{noun}}',
        'the {{noun}} of {{a_noun}} becomes {{an_adjective}} {{noun}}',
        '{{a_noun}} is {{a_noun}}\'s {{noun}}',
        '{{a_noun}} is the {{noun}} of {{a_noun}}',
        '{{an_adjective}} {{noun}}\'s {{noun}} comes with it the thought that the {{adjective}} {{noun}} is {{a_noun}}',
        '{{nouns}} are {{adjective}} {{nouns}}',
        '{{adjective}} {{nouns}} show us how {{nouns}} can be {{nouns}}',
        'before {{nouns}}, {{nouns}} were only {{nouns}}',
        'those {{nouns}} are nothing more than {{nouns}}',
        'some {{adjective}} {{nouns}} are thought of simply as {{nouns}}',
        'one cannot separate {{nouns}} from {{adjective}} {{nouns}}',
        'the {{nouns}} could be said to resemble {{adjective}} {{nouns}}',
        '{{an_adjective}} {{noun}} without {{nouns}} is truly a {{noun}} of {{adjective}} {{nouns}}'
      ];
      var phrases = [
        'to be more specific, ',
        'in recent years, ',
        'however, ',
        'by the way',
        'of course, ',
        'some assert that ',
        'if this was somewhat unclear, ',
        'unfortunately, that is wrong; on the contrary, ',
        'it\'s very tricky, if not impossible, ',
        'this could be, or perhaps ',
        'this is not to discredit the idea that ',
        'we know that ',
        'it\'s an undeniable fact, really; ',
        'framed in a different way, ',
        'what we don\'t know for sure is whether or not ',
        'as far as we can estimate, ',
        'as far as he is concerned, ',
        'the zeitgeist contends that ',
        'though we assume the latter, ',
        'far from the truth, ',
        'extending this logic, ',
        'nowhere is it disputed that ',
        'in modern times ',
        'in ancient times ',
        'recent controversy aside, ',
        'washing and polishing the car,',
        'having been a gymnast, ',
        'after a long day at school and work, ',
        'waking to the buzz of the alarm clock, ',
        'draped neatly on a hanger, ',
        'shouting with happiness, '
      ];
      let random;
      const setRandom = (newRandom) => {
        random = newRandom;
      };
      setRandom(Math.random);
      const randfloat = () => random();
      const randint = (min, max) => {
        const offset = min;
        const range = max - min + 1;
        return Math.floor(randfloat() * range) + offset;
      };
      const rand = (a) => {
        let w;
        while (!w) {
          w = a[randint(0, a.length - 1)];
        }
        return w;
      };
      const pluralize = (word) => {
        if (word.endsWith('s')) {
          return word;
        }
        if (word.match(/(ss|ish|ch|x|us)$/)) {
          word += 'e';
        } else if (word.endsWith('y') && !vowels.includes(word.charAt(word.length - 2))) {
          word = word.slice(0, word.length - 1);
          word += 'ie';
        }
        return word + 's';
      };
      const normalize = (word) => {
        let a = 'a';
        if (word.match(/^(a|e|i|o)/)) {
          a = 'an';
        }
        return `${a} ${word}`;
      };

      const actions = [
        'noun', 'a_noun', 'nouns',
        'adjective', 'an_adjective',
      ];
      const generator = {
        noun: () => {
          return rand(nouns);
        },
        a_noun: () => {
          return normalize(rand(nouns));
        },
        nouns: () => {
          return pluralize(rand(nouns));
        },
        adjective: () => {
          return rand(adjectives);
        },
        an_adjective: () => {
          return normalize(rand(adjectives));
        },
      };
      const trim = (s) => {
        return s.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '')
          .replace(/\r?\n|\r/g, ' ')
          .replace(/\s\s+|\r/g, ' ');
      };
      const make = (template) => {
        let sentence = template;
        const occurrences = template.match(/\{\{(.+?)\}\}/g);
        if (occurrences && occurrences.length) {
          for (let i = 0; i < occurrences.length; i++) {
            const action = trim(occurrences[i].replace('{{', '').replace('}}', ''));
            let result;
            if (actions.includes(action)) {
              result = generator[action]();
            }
            sentence = sentence.replace(occurrences[i], result);
          }
        }
        return sentence;
      };
      const randomStartingPhrase = () => {
        if (randfloat() < 0.33) {
          return rand(phrases);
        }
        return '';
      };
      const makeSentenceFromTemplate = () => {
        return make(rand(sentenceTemplates));
      };
      const sentence = () => {
        const phrase = randomStartingPhrase();
        let s = phrase + makeSentenceFromTemplate();
        s = s.charAt(0).toUpperCase() + s.slice(1);
        s += '.';
        return s;
      };
      const paragraph = () => {
        const t = 2;
        const a = [];
        while (a.length < t) {
          const s = sentence();
          a.push(s);
        }
        return a.join(' ');
      };
      this.randomText = paragraph();
    },
  },
  created() {
    this.RandomizeText();
  }
};
</script>

<style>
.centerbox {
  border-radius: 25px;
  background-color: #424242;
  color: aliceblue;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  overflow: auto;
  padding: 1%;
}
svg {
  vertical-align: unset !important;
}

h1 {
  overflow: hidden; 
  white-space: nowrap; 
  margin: 0 auto; 
  letter-spacing: .20em; 
}

h5 {
  overflow: hidden; 
  margin: 0 auto; 
  letter-spacing: .20em; 
}

</style>