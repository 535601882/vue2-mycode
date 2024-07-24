export default {
  init({ canvas, scoreElement, restartButton }) {
    // **************游戏状态*********************************
    // waiting | stretching | turning | wrlking | transitioning | falling
    // 等待|伸展|转身|行走|过渡|坠落
    // eslint-disable-next-line no-unused-vars
    let phase = "waiting"; // 当前状态
    // 前一个动画周期的时间戳
    // eslint-disable-next-line no-unused-vars
    let lastTimestamp;

    // 人物移动位置
    let heroX;
    // 人物跌落
    let heroY;
    // 移动整个游戏
    let sceneOffset;

    // 平台数据
    let platforms = [];
    // 棍子
    // eslint-disable-next-line no-unused-vars
    let sticks = [];
    let trees = []; // 树
    let score = 0; // 分数

    //***********************configuration*************************
    // dom
    const ctx = canvas.getContext("2d");
    const canvasWidth = 375;
    const canvasHiehgt = 375;
    const platformHiehgt = 100;

    // 这些值表示将棍子增长一个像素、将棍子转动一度、行走一个像素等需要多少毫秒。
    const stretchingSpeed = 4; // 拉伸速度
    const turningSpeed = 4; // 旋转变化速度
    const walkingSpeed = 4; // 移动速度
    const transitioningSpeed = 2; // 变换速度
    const fallingSpeed = 2; // 跌落速度
    const backgroundSpeedMultiplier = 0.2;
    //***********************start Game*************************
    resetGame();
    //***********************reset Game*************************
    function resetGame() {
      phase = "waiting"; // 初始状态
      lastTimestamp = undefined;
      // 第一个平台
      platforms = [{ x: 50, w: 50 }];
      // 生成平台坐标
      generatePlatform();
      generatePlatform();
      generatePlatform();
      generatePlatform();

      // 英雄站在第一个平台最右边
      heroX = platforms[0].x + platforms[0].w - 30;
      heroY = 0;
      // 重置分数
      sceneOffset = 0;

      // 初始棍子，起点为平台最右边，长度0，角度0
      sticks = [
        {
          x: platforms[0].x + platforms[0].w,
          length: 0,
          rotation: 0,
        },
      ];
      // 生成树
      trees = [];
      generateTree();
      generateTree();
      generateTree();
      generateTree();
      generateTree();
      generateTree();
      generateTree();
      generateTree();
      generateTree();
      generateTree();

      score = 0;
      // 重置UI
      restartButton.style.display = "none";
      scoreElement.innerText = score;
      draw();
    }
    // 生成树
    function generateTree() {
      const minimumGap = 30;
      const maximumGap = 150;

      const lastTree = trees[trees.length - 1];
      let furthestX = lastTree ? lastTree.x : 0;

      const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
      const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
      const color = treeColors[Math.floor(Math.random() * 3)];
      trees.push({ x, color });
    }
    // 随机生成平台宽度和位置
    function generatePlatform() {
      const minimumGap = 40;
      const maximumGap = 200;
      const minimumWidth = 20;
      const maximumWidth = 100;

      // 最后一个平台
      const lastPlatform = platforms[platforms.length - 1];
      // 起点
      let furthestX = lastPlatform.x + lastPlatform.w;

      // 映射到指定范围内的整数
      const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
      const w = minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

      platforms.push({ x, w });
    }
    //***********************draw*************************
    function draw() {
      ctx.clearRect(0, 0, canvasWidth, canvasHiehgt);
      // 保存当前转换
      ctx.save();
      // 绘制背景
      drawBackground();
      // translate命令实际上并不移动画布上的任何内容(移动坐标系)
      ctx.translate(-sceneOffset, 0);

      // 绘制
      drawPlatforms();
      drawHero();
      drwaSticks();

      // 将转换恢复到上次保存
      ctx.restore();
    }
    function drawPlatforms() {
      platforms.forEach((item) => {
        ctx.fillStyle = "black";
        ctx.fillRect(item.x, canvasHiehgt - platformHiehgt, item.w, platformHiehgt);
      });
    }
    function drawHero() {
      console.log("绘制hero");
      const heroWidth = 20;
      const heroHeight = 30;
      ctx.fillStyle = "red";
      ctx.fillRect(heroX, heroY + canvasHiehgt - platformHiehgt - heroHeight, heroWidth, heroHeight);
    }
    function drwaSticks() {
      sticks.forEach((stick) => {
        ctx.save();
        // 将锚点移动到操纵杆的起点并旋转
        ctx.translate(stick.x, canvasHiehgt - platformHiehgt);
        // 将角度 stick.rotation 转换为弧度制
        ctx.rotate((Math.PI / 180) * stick.rotation);
        // 绘制
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -stick.length);
        ctx.stroke();

        ctx.restore();
      });
    }

    // 绘制背景
    function drawBackground() {
      var gradient = ctx.createLinearGradient(0, 0, 0, 375); // window.innerHeight
      gradient.addColorStop(0, "#BBD691");
      gradient.addColorStop(1, "#FEF1E1");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 375, 375); //window.innerWidth, window.innerHeight

      trees.forEach((tree) => drawTree(tree.x, tree.color));
    }
    // 绘制波形
    // eslint-disable-next-line no-unused-vars
    function drawHill(baseHeight, amplitude, stretch, color) {
      ctx.beginPath();
      ctx.moveTo(0, 375);
      ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
      for (let i = 0; i < 375; i++) {
        ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
      }
      ctx.lineTo(375, 375);
      ctx.fillStyle = color;
      ctx.fill();
    }
    // 绘制树
    function drawTree() {}
    function getHillY(windowX, baseHeight, amplitude, stretch) {
      const sineBaseY = 375 - baseHeight;
      return Math.sinus((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) * amplitude + sineBaseY;
    }
    //***********************addeventListener*************************
    window.addEventListener("mousedown", function (event) {
      console.log(event);
      if (phase !== "waiting") return;
      // 拉伸
      phase = "stretching";
      lastTimestamp = undefined;
      window.requestAnimationFrame(animate);
    });
    window.addEventListener("mouseup", function (event) {
      console.log(event);
      if (phase === "stretching") {
        // 旋转
        phase = "turning";
      }
    });

    restartButton.addEventListener("click", function (event) {
      console.log(event);
      resetGame();
      restartButton.style.display = "none";
    });
    //***********************animate*************************
    // eslint-disable-next-line no-unused-vars
    function animate(timestamp) {
      if (!lastTimestamp) {
        // 第一次
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
      }
      let timePassed = timestamp - lastTimestamp;
      switch (phase) {
        case "waiting": {
          return;
        }
        case "stretching": {
          sticks[sticks.length - 1].length += timePassed / stretchingSpeed;
          break;
        }
        case "turning": {
          sticks[sticks.length - 1].rotation += timePassed / turningSpeed;
          // 不能超过90度
          if (sticks[sticks.length - 1].rotation >= 90) {
            sticks[sticks.length - 1].rotation = 90;
            // 确定棍子是否落到了平台上
            const nextPlatform = thePlatformTheStickHits();
            if (nextPlatform) {
              // 增加分数
              score++;
              scoreElement.innerText = score;
              // 生成下一个平台
              generatePlatform();
              generateTree();
              generateTree();
            }
            // 开始移动
            phase = "walking";
          }
          break;
        }
        case "walking": {
          heroX += timePassed / walkingSpeed;
          // 确定棍子是否落到了平台上
          const nextPlatform = thePlatformTheStickHits();
          if (nextPlatform) {
            // 移动到平台最右侧
            const maxHeroX = nextPlatform.x + nextPlatform.w - 30;
            if (heroX >= maxHeroX) {
              heroX = maxHeroX;
              phase = "transitioning";
            }
          } else {
            // 移动到棍子最右侧
            const maxHeroX = sticks[sticks.length - 1].x + sticks[sticks.length - 1].length;
            if (heroX > maxHeroX) {
              heroX = maxHeroX;
              phase = "falling"; // 下落
            }
          }
          break;
        }
        case "transitioning": {
          sceneOffset += timePassed / transitioningSpeed;
          // 确定棍子是否落到了平台上
          const nextPlatform = thePlatformTheStickHits();
          if (nextPlatform.x + nextPlatform.w - sceneOffset < 100) {
            sticks.push({
              x: nextPlatform.x + nextPlatform.w,
              length: 0,
              rotation: 0,
            });
            phase = "waiting";
          }
          break;
        }
        case "falling": {
          heroY += timePassed / fallingSpeed;
          if (sticks[sticks.length - 1].rotation < 180) {
            sticks[sticks.length - 1].rotation += timePassed / turningSpeed;
          }
          // 平台高度 + 英雄高度
          const maxHeroY = platformHiehgt + 100;
          if (heroY > maxHeroY) {
            restartButton.style.display = "block";
            return;
          }
          break;
        }
      }
      draw();
      lastTimestamp = timestamp;
      window.requestAnimationFrame(animate);
    }
    //确定棍子是否落到了平台上
    function thePlatformTheStickHits() {
      // 最后一个棍子
      let lastStick = sticks[sticks.length - 1];
      // 棍子在X轴的长度
      const stickFarX = lastStick.x + lastStick.length;
      // 下一个平台
      const platformTheStickHits = platforms.find((platform) => {
        return platform.x < stickFarX && stickFarX < platform.x + platform.w;
      });

      return platformTheStickHits;
    }
  },
};
