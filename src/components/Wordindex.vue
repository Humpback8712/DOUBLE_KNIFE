<template>
    <div class="box">
    <el-container class="container">
    <el-header>DOUBLE KNIFE</el-header>
    <el-main>
        <div class="up">
            <div class="goal">
              <el-button :type="attr1" round @click="getFour">四级词汇</el-button>
              <el-button :type="attr2" round @click="getSix">六级词汇</el-button>
              <el-button :type="attr3" round @click="getGradual" :disabled='disable'>研究生</el-button>
              <span class="setspeed">设置速度{{ speed }}</span>
            <div class="slider">
                <el-slider
                v-model="speed"
                vertical
                height="200px"
                :step="10"
                :max="90"
                :min="10"
                :disabled="flag"
                >
                </el-slider>
                    </div>
              <el-card shadow="always">
                当前分数：{{ score }}
              </el-card>

            </div>
            <div class="window">
                <div class="innerBox">
                    <div v-for="(word,index) in wordList" :key="index" :style="classList[index]" class="wordbox">
                        {{ word }}
                    </div>
                </div>
            </div>
            <div class="ranking">
              <div class="title">排名</div>
              <div class="rank">
                <div class="no" v-for="(rank,index) in rankScore" :key="index">
                      <el-tag>{{rank.name}}</el-tag>--{{ rank.score }}
                </div>
              </div>
            </div>
        </div>
        <div class="input">
            <el-button @click="startGame" :disabled="flag">开始</el-button>
            <el-input v-model="inputWord" placeholder="请输入单词" @keyup.enter.native="checkOut"></el-input>
            <el-button @click="reSet">重置</el-button>
        </div>
    </el-main>
    <el-footer>
        <div class="connect">
             <el-link type="primary" :underline="false">请作者喝杯咖啡</el-link><br>
             <el-link type="success" :underline="false">GitHub地址</el-link>  <p>|</p>
             <el-link type="danger" :underline="false">加入我们</el-link>  <p>|</p>
             <el-link type="warning" :underline="false">关于</el-link>
        </div>
    </el-footer>
    </el-container>
    </div>
</template>

<script>
export default {
  data () {
    return {
      speed: 0,
      score: 0,
      flagScore: 0,
      classList: [],
      wordList: [],
      inputWordList: [],
      inputWord: '',
      interval1: function () {},
      interval2: function () {},
      interval3: function () {},
      timer: 1000,
      flag: false,
      rankFlag: 4,
      fourURL: 'http://127.0.0.1:8001/word4/',
      sixURL: 'http://127.0.0.1:8001/word6/',
      gradualURL: 'http://127.0.0.1:8001/wordg/',
      rankPOSTURL: 'http://127.0.0.1:8001/word/rankcheck',
      mountedURL: 'http://127.0.0.1:8001/word/rankcheck',
      attr1: 'success',
      attr2: 'primary',
      attr3: 'primary',
      disable: true,
      rankScore: []
    }
  },
  methods: {
    getRankList: async function () {
      const result = await this.$http.get(this.mountedURL)
      for (var i = 0; i < 10; i++) {
        this.rankScore.push(result.data[i])
      }
    },
    postRank: async function (uname) {
      var jsonObj = {
        uname: uname,
        score: this.flagScore
      }
      const result = await this.$http.post(this.mountedURL, jsonObj)
      console.log(result)
      this.flagScore = 0
    },
    getList: function () {
      if (this.rankFlag === 4) {
        this.getWordList(this.fourURL)
      } else if (this.rankFlag === 6) {
        this.getWordList(this.sixURL)
      } else {
        this.getWordList(this.gradualURL)
      }
    },
    getFour: function () {
      this.rankFlag = 4
      this.attr1 = 'success'
      this.attr2 = 'primary'
      this.attr3 = 'primary'
    },
    getSix: function () {
      this.rankFlag = 6
      this.attr1 = 'primary'
      this.attr2 = 'success'
      this.attr3 = 'primary'
    },
    getGradual: function () {
      this.rankFlag = 'g'
      this.attr1 = 'primary'
      this.attr2 = 'primary'
      this.attr3 = 'success'
    },
    startGame: function () {
      this.setSpeed()
      this.getList()
      this.startInterval()
      this.flag = true
    },
    setSpeed: function () {
      var speed = this.speed
      this.timer = (100 - speed) * 100
      console.log(this.timer)
    },
    checkOut: function () {
      for (var i = 0; i < this.inputWordList.length; i++) {
        if (this.inputWord === this.wordList[i]) {
          this.wordList.splice(i, 1)
          this.classList.splice(i, 1)
          this.score += 1
          this.inputWord = ''
        }
      }
    },
    reSet: function () {
      clearInterval(this.interval1)
      clearInterval(this.interval2)
      this.inputWord = ''
      console.log(this.wordList)
      this.wordList = []
      this.flag = false
      this.score = 0
    },
    getWordList: async function (url) {
      const result = await this.$http.get(url)
      for (var i = 0; i < result.data.length; i++) {
        this.inputWordList.push(result.data[i].word)
      }
    },
    startInterval: function () {
      this.interval1 = setInterval(this.pushWord, this.timer)
      this.interval2 = setInterval(this.setClass, this.timer)
      this.interval3 = setInterval(this.check20, this.timer)
    },
    check20: function () {
      if (this.wordList.length > 20) {
        clearInterval(this.interval3)
        this.flagScore = this.score
        this.endGame()
        this.reSet()
      }
    },
    pushWord: function () {
      this.wordList.push(this.inputWordList[0])
      this.inputWordList.splice(0, 1)
    },
    setClass: function () {
      var obj = {}
      obj.top = this.getTop() + 'px'
      obj.left = this.getLeft() + 'px'
      obj.fontSize = this.getFont() + 'px'
      obj.color = 'black'
      this.classList.push(obj)
    },
    getRandom: function (start, end, fixed = 0) {
      const differ = end - start
      const random = Math.random()
      return (start + differ * random).toFixed(fixed)
    },
    getTop: function () {
      var h = this.getRandom(0, 530)
      return h
    },
    getLeft: function () {
      var r = this.getRandom(0, 800)
      return r
    },
    getFont: function () {
      var f = this.getRandom(20, 50)
      return f
    },
    endGame: function () {
      console.log(this.rankScore[9])
      var lastScore = JSON.parse(JSON.stringify(this.rankScore))[9].score
      if (this.score >= lastScore) {
        this.setScore()
      } else {
        this.$alert('这一次的分数是' + this.score, '下次加油！！！', {
          confirmButtonText: '确定'
        })
        this.score = 0
      }
    },
    setScore: function () {
      this.$prompt('恭喜上榜，请输入姓名', '上榜！！！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{3,6}$/,
        inputErrorMessage: '名字不符合规范了，请控制在三到六个字符内'
      }).then(({ value }) => {
        this.postRank(value)
        this.$message({
          type: 'success',
          message: '成功上传成绩，请刷新查看排行榜'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  },
  created () {
    this.getRankList()
  }
}

</script>

<style scoped>
    .box {
        height: 100%;
    }
    .el-header {
        border-bottom: 2px solid #DCDFE6;
        margin: 0 80px;
        font-size: 35px;
        line-height: 70px;

    }
    .goal{
        background-color: #fff;
        float: left;
        height: 580px;
        width: 9%;
        margin-right: 2px;
        text-align: center;
    }
    .ranking {
        float: left;
        height: 580px;
        margin-left: 2px;
        width: 9%;
    }
    .el-main {
        padding: 0;
        margin: 20px auto;
        width: 84%;
    }
    .window {
        float: left;
        display: relative;
        width: 80%;
        height: 580px;
        background-color: #fff;
        border-radius: 4px;
        border: 2px solid #DCDFE6;
        margin-left: 3px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .innerBox {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #fff;
    }
    .input {
        display: inline-block;
        width: 600px;
        height: 50px;
        padding-top: 20px;
        margin-left: 50%;
        transform: translate(-50%);
    }
    .input .el-button {
        display: inline-block;
    }
    .el-input {
        width: 400px;
        display: inline-block;
    }
    .connect {
        text-align: center;
    }
    .el-link {
        margin-left: 15px;
    }
    .connect p {
        display: inline-block;
        margin: 0 2px;
    }
    .el-button+.el-button {
        margin-left: 0;
        margin-top: 20px;
    }
    .slider {
        margin-top: 30px;
        margin-bottom: 30px;
        margin-left: 50%;
        transform: translate(-50%);
    }
    .setspeed {
        display: inline-block;
        margin-top: 20px;
    }
    .el-card__body {
        padding: 12px;
    }
    .ranking {
        text-align: center;
    }
    .wordbox{
        position: absolute;
        display: inline-block;
        right: 0;
        top: 0;
        color: #fff;
    }
    .title {
      font-size: 30px;
      margin-bottom: 8px;
      border-bottom: 1px solid #ccc;
    }
    .el-tag {
      font-size: 20px;
      padding: 1px;
    }
    .no {
      margin-top: 20px;
    }
</style>
