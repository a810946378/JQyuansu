window.onload = function () {

  // 初始化所有的li
  (function () {
    var len = 5 * 5 * 5;  // 定义生成多少个li
    var oUl = document.getElementById("list").children[0]; // 获取ul
    var aLi = oUl.children;

    // 初始化
    (function () {
      // 通过for循环动态创建li
      for (var i = 0; i < len; i++) {
        // 创建li元素
        var oLi = document.createElement('li');

        // 通过自定义属性来记录索引
        oLi.index = i;

        // 根据索引记录坐标位置
        oLi.x = i % 5;
        oLi.y = Math.floor(i % 25 / 5)
        oLi.z = 4 - Math.floor(i / 25);

        // 获取数据
        var data = flyData[i] || flyData[0]

        oLi.innerHTML = `
          <b class="cover"></b>
          <p class="title">${data.type}</p>
          <p class="author">${data.author}</p>
          <p class="time">${data.time}</p>
        `

        // 随机确定li的位置
        var tx = Math.random() * 6000 - 3000;
        var ty = Math.random() * 6000 - 3000;
        var tz = Math.random() * 6000 - 3000;

        oLi.style.transform = `translate3d(${tx}px, ${ty}px , ${tz}px)`

        // 把li加入页面
        oUl.appendChild(oLi)
      }
      // Grid()
      setTimeout(Grid, 20)

    })();


    // 拖拽,缩放
    (function () {
      // 信号量保存初始值
      var roX = 0,
        roY = 0,
        trZ = -2000;

      // 通过事件禁止文字被选中
      document.onselectstart = function () {
        return false
      }

      // 鼠标按下
      document.onmousedown = function (ev) {
        ev = ev || window.event;

        //  sX = ev.clientX,
        //   sY = ev.clientY,
        var lastX = ev.clientX,
          lastY = ev.clientY,
          x_ = 0,
          y_ = 0;    // 存储移动的插值


        var ifMove = false;      // 判断有没有移动
        var ifTime = new Date();  // 鼠标按下的时间戳

        // 用于解决当鼠标按下和抬起在同一元素上
        if (ev.target.nodeName === 'B') {
          var thisLi = ev.target
        }


        // 鼠标移动 
        this.onmousemove = function (ev) {
          ev = ev || window.event;

          ifMove = true;  // 鼠标移动了

          x_ = ev.clientX - lastX;
          y_ = ev.clientY - lastY;


          // 根据位移确定旋转度数
          roY += x_ * 0.1;
          roX -= y_ * 0.1;

          oUl.style.transform = ` translateZ(${trZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;

          // 重新赋值
          lastX = ev.clientX;
          lastY = ev.clientY;
        }


        // 鼠标松开
        this.onmouseup = function (ev) {
          if (ifMove && (ev.target === thisLi) || (new Date() - ifTime) > 500) {
            if (ev.target.nodeName === 'B') {
              thisLi.goudan = true
            }
          }

          // 清楚鼠标移动事件
          this.onmousemove = null

          // 计算缓冲
          function m() {

            // 通过缓冲系数处理缓冲距离
            x_ *= 0.9;
            y_ *= 0.9;

            // 根据位移确定旋转度数
            roY += x_ * 0.1;
            roX -= y_ * 0.1;

            oUl.style.transform = ` translateZ(${trZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;

            // 如果条件满足,清楚清除定时器
            if (Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1) return

            requestAnimationFrame(m)
          }
          requestAnimationFrame(m)
        }
      }


      // 滚轮滚动改变Z轴变化
      !function (fn) {
        if (document.onmousewheel === undefined) {
          // 火狐浏览
          document.addEventListener("DOMMouseScroll", function (e) {
            var d = -e.detail / 3
            fn(d)
          }, false)
        } else {
          // 主流浏览器
          document.onmousewheel = function (e) {
            var d = e.wheelDelta / 120;
            fn(d)
          }
        }
      }(function (d) {
        trZ += d * 100;
        oUl.style.transform = ` translateZ(${trZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`
      })


    })();


    // Alert弹窗
    (function () {
      // 获取所有需要操作的DOM元素
      var oAlert = document.getElementById('alert'),
        oATitle = oAlert.getElementsByClassName('title')[0].getElementsByTagName('span')[0],
        oAImg = oAlert.getElementsByClassName('img')[0].getElementsByTagName('img')[0],
        oAAuthor = oAlert.getElementsByClassName('author')[0].getElementsByTagName('span')[0],
        oAInfo = oAlert.getElementsByClassName('info')[0].getElementsByTagName('span')[0];

      // 获取点击弹窗需要变化元素
      var oAll = document.getElementById('all');
      var oFrame = document.getElementById("frame");
      var oBack = document.getElementById('back');



      // 通过事件委托, 批量绑定事件
      oUl.onclick = function (ev) {
        ev = ev || window.event;

        // 获取事件源对象
        var target = ev.target;
        if (target.nodeName === 'B') {
          if (target.goudan) {
            target.goudan = false;
          } else {
            if (oAlert.style.display === 'block') {
              // 隐藏
              hide()
            } else {
              // 改变弹窗的内容
              var index = target.parentNode.index;
              var data = flyData[index] || flyData[0];

              // oAlert.index = index;
              // oAlert.data = data;
              oAlert.src = data.src;

              // 填充数据
              oATitle.innerHTML = `课题: ${data.title}`;
              oAImg.src = `./src/${data.src}/index.png`;
              oAAuthor.innerHTML = `主讲: ${data.author}`;
              oAInfo.innerHTML = `描述: ${data.desc}`;

              // 显示
              show()
            }
          }

        }

        //阻止冒泡
        ev.cancelBubble = true;
      }

      // 点击页面任何位置隐藏
      document.onclick = function () {
        hide()
      }

      // 返回
      oBack.onclick = function () {
        oAll.className = ''
      }

      // 当点击弹窗的时候, 显示右侧信息
      oAlert.onclick = function (ev) {
        ev.cancelBubble = true;

        // var data = flyData[this.index] || flyData[0];
        oAll.className = 'left'
        oFrame.src = `./src/${this.src}/index.html`
      }

      // 隐藏函数
      function hide() {
        if (oAlert.style.display === 'block' && !oAlert.timer) {


          oAlert.timer = true;
          // 确定弹出的初始值
          oAlert.style.display = 'block';
          oAlert.style.transform = `rotateY(0deg) scale(1)`
          oAlert.style.opacity = 1;

          // 动画
          var time = 300;  // 动画完成的时间
          var sTime = new Date()  // 获取动画开始的时间
          function m() {
            var prop = (new Date() - sTime) / time;  // 时间比例 0-1

            // 判断终止 
            if (prop >= 1) {
              // 超出拉回
              prop = 1;
              oAlert.style.display = 'none';
              oAlert.timer = false
            } else {
              requestAnimationFrame(m)
            }
            oAlert.style.transform = `rotateY(${180 * prop}deg) scale(${1 - prop})`
            oAlert.style.opacity = 1 - prop
          }

          requestAnimationFrame(m)
        }
      }

      // 显示函数
      function show() {
        if (oAlert.timer) return
        oAlert.timer = true;

        oAlert.style.display = 'block';

        // 初始值
        oAlert.style.transform = `rotateY(0deg) scale(2)`;
        oAlert.style.opacity = 0;

        // 动画过度
        var time = 300;  // 动画完成的时间
        var sTime = new Date()  // 获取动画开始的时间
        function m() {
          var prop = (new Date() - sTime) / time;  // 时间比例 0-1

          // 判断终止 
          if (prop >= 1) {
            // 超出拉回
            prop = 1;
            oAlert.timer = false;
          } else {
            requestAnimationFrame(m)
          }
          oAlert.style.transform = `rotateY(0deg) scale(${2 - prop})`
          oAlert.style.opacity = prop
        }

        requestAnimationFrame(m)
      }


    })();

    // 左下角的点击按钮
    (function () {
      var aBtn = document.getElementById('btn').getElementsByTagName('li');
      var arr = [Table, Sphere, Heilx, Grid]

      // aBtn[0].onclick = arr[0];
      // aBtn[1].onclick = arr[1];
      // aBtn[2].onclick = arr[2];
      // aBtn[3].onclick = arr[3]

      // for (var i = 0; i < aBtn.length; i++) {
      //   aBtn[i].onclick = arr[i]
      // }

      var btnArr = [...aBtn]
      btnArr.forEach(function (btn, index) {
        btn.onclick = arr[index]
      })
    })()

    // Table 元素周期表
    function Table() {
      if (Table.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Table.arr[i]
        }
      } else {
        console.log("Table")

        Table.arr = [];

        // 计算坐标
        var n = Math.ceil(len / 18) + 2;  // 计算一共排列多好行
        var midY = n / 2 - 0.5;  // 计算ul所在的行
        var midX = 18 / 2 - 0.5;   // 计算ul所在的列

        // 每个li 水平垂直的间距
        var disY = 210;
        var disX = 170;

        // 开始的18 固定li的坐标
        var arr = [
          { x: 0, y: 0, },
          { x: 17, y: 0, },
          { x: 0, y: 1, },
          { x: 1, y: 1, },
          { x: 12, y: 1, },
          { x: 13, y: 1, },
          { x: 14, y: 1, },
          { x: 15, y: 1, },
          { x: 16, y: 1, },
          { x: 17, y: 1, },
          { x: 0, y: 2, },
          { x: 1, y: 2, },
          { x: 12, y: 2, },
          { x: 13, y: 2, },
          { x: 14, y: 2, },
          { x: 15, y: 2, },
          { x: 16, y: 2, },
          { x: 17, y: 2, },
        ]

        // 循环计算li的位置
        for (var i = 0; i < len; i++) {
          var x, y;
          if (i < 18) {
            x = arr[i].x
            y = arr[i].y
          } else {
            x = i % 18;
            y = Math.floor(i / 18) + 2
          }


          var val = `translate3d(${(x - midX) * disX}px, ${(y - midY) * disY}px , 0px)`;

          Table.arr[i] = val
          aLi[i].style.transform = val;
        }
      }
    }

    // Sphere  球形
    function Sphere() {
      if (Sphere.arr) {

        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Sphere.arr[i];
        }
      } else {
        console.log("Sphere")

        Sphere.arr = []

        // 确定球的每个牌面有多少个li
        var arr = [1, 3, 7, 9, 11, 14, 21, 20, 12, 10, 9, 7, 1];
        var arrLen = arr.length;  // 球一共有多少层
        var xDeg = 180 / (arrLen - 1); // 计算每一层li绕X轴旋转多少度

        // 循环设置
        for (var i = 0; i < len; i++) {

          // 定义变量计算当前的li是第几层,以及当前层的第几个li
          var numC = 0;  // 保存li在第几层
          var numG = 0;  // 保存li在当前层的第几个
          var arrSum = 0;  // 用来确定li之前层的总数

          // 判断li的层以及在当前层的第几个
          for (var j = 0; j < arrLen; j++) {
            arrSum += arr[j]  // arrSum  1 4
            if (i < arrSum) {
              numC = j  // 计算当前li的层
              numG = i - (arrSum - arr[j]);  // 计算当前li处于当前层的第几个
              break;   // 当我们确定li所在的层,以及所在层的第几个之后,跳出j的循环
            }
          }

          // 更加li所在的层的li的个数,确定li的绕着y轴旋转的度数
          var yDeg = 360 / arr[numC]

          var val = `rotateY(${(numG + 1.2) * yDeg}deg) rotateX(${90 - numC * xDeg}deg) translateZ(800px)`;
          Sphere.arr[i] = val
          aLi[i].style.transform = val;
        }
      }

    }


    // Heilx 螺旋
    function Heilx() {
      if (Heilx.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Heilx.arr[i]
        }

      } else {
        console.log("Heilx")
        Heilx.arr = [];

        var h = 4; // 圈数
        var tY = 7; // 每个li上下错位7 像素
        var num = Math.round(len / h); // 计算每一圈多少个li
        var deg = 360 / num;   // 计算每一个li的旋转度数
        var mid = len / 2 - 0.5; // 确定ul的位置

        for (var i = 0; i < len; i++) {
          var val = `rotateY(${i * deg}deg) translateY(${tY * (i - mid)}px) translateZ(800px)`;
          Heilx.arr[i] = val
          aLi[i].style.transform = val;
        }
      }


    }

    //  Grid 层叠样式 
    function Grid() {

      if (Grid.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Grid.arr[i];
        }
      } else {
        console.log("Grid")

        Grid.arr = []

        // 确定每个li之间水平垂直,以及z轴的间隔
        var disX = 350;
        var disY = 350;
        var disZ = 800;

        for (var i = 0; i < len; i++) {
          var oLi = aLi[i];

          // 通过li的位置计算li的偏移量
          var x = (oLi.x - 2) * disX;
          var y = (oLi.y - 2) * disY;
          var z = (oLi.z - 2) * disZ;

          var val = `translate3d(${x}px, ${y}px , ${z}px)`;
          Grid.arr[i] = val
          oLi.style.transform = val;
        }

        // console.log(Grid.arr)
      }

    }
  })()
}