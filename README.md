# Resizable Layout

Resizable Layout is a flexible and customizable layout with resizable panels. It allows users to adjust the size of different sections of the interface by dragging the panel dividers, providing a dynamic and user-friendly experience.
Visit the website, open the DevTools console and run these scripts to see the layout animations in action. Enjoy the results :D

### 1. Synchronized Pulse (all panels grow and shrink together)

````javascript
function animatePulse() {
    if (
        typeof window.setSidebarWidth !== "function" ||
        typeof window.setEditorWidth !== "function" ||
        typeof window.setInputHeight !== "function"
    ) return alert("Global functions not found!");

    let t = 0, running = true;
    function lerp(a, b, t) { return a + (b - a) * t; }
    function loop() {
        if (!running) return;
        const s = (Math.sin(t) + 1) / 2;
        window.setSidebarWidth(lerp(10, 30, s));
        window.setEditorWidth(lerp(20, 80, s));
        window.setInputHeight(lerp(10, 60, s));
        t += 0.025;
        requestAnimationFrame(loop);
    }
    loop();
    window.stopSatisfyingLayoutAnimation = () => { running = false; };
}
animatePulse();
````

---

### 2. "Wave" Effect (each panel oscillates with a different phase)

````javascript
function animateWave() {
    if (
        typeof window.setSidebarWidth !== "function" ||
        typeof window.setEditorWidth !== "function" ||
        typeof window.setInputHeight !== "function"
    ) return alert("Global functions not found!");

    let t = 0, running = true;
    function lerp(a, b, t) { return a + (b - a) * t; }
    function loop() {
        if (!running) return;
        window.setSidebarWidth(lerp(10, 30, (Math.sin(t) + 1) / 2));
        window.setEditorWidth(lerp(0, 100, (Math.sin(t + 1) + 1) / 2));
        window.setInputHeight(lerp(0, 60, (Math.sin(t + 2) + 1) / 2));
        t += 0.03;
        requestAnimationFrame(loop);
    }
    loop();
    window.stopSatisfyingLayoutAnimation = () => { running = false; };
}
animateWave();
````

---

### 3. "Bounce" (each panel goes from min to max and back, one at a time)

````javascript
function animateBounce() {
    if (
        typeof window.setSidebarWidth !== "function" ||
        typeof window.setEditorWidth !== "function" ||
        typeof window.setInputHeight !== "function"
    ) return alert("Global functions not found!");

    let t = 0, running = true;
    function lerp(a, b, t) { return a + (b - a) * t; }
    function loop() {
        if (!running) return;
        const phase = (t % 3);
        if (phase < 1) {
            window.setSidebarWidth(lerp(10, 30, phase));
            window.setEditorWidth(50);
            window.setInputHeight(30);
        } else if (phase < 2) {
            window.setSidebarWidth(30);
            window.setEditorWidth(lerp(0, 100, phase - 1));
            window.setInputHeight(30);
        } else {
            window.setSidebarWidth(30);
            window.setEditorWidth(100);
            window.setInputHeight(lerp(0, 60, phase - 2));
        }
        t += 0.02;
        requestAnimationFrame(loop);
    }
    loop();
    window.stopSatisfyingLayoutAnimation = () => { running = false; };
}
animateBounce();
````

---

### 4. "Smooth Random" (values smoothly change to random targets)

````javascript
function animateRandomSmooth() {
    if (
        typeof window.setSidebarWidth !== "function" ||
        typeof window.setEditorWidth !== "function" ||
        typeof window.setInputHeight !== "function"
    ) return alert("Global functions not found!");

    let running = true;
    let sidebar = 15, editor = 50, input = 30;
    let targetSidebar = 15, targetEditor = 50, targetInput = 30;

    function randomizeTargets() {
        targetSidebar = 10 + Math.random() * 20;
        targetEditor = Math.random() * 100;
        targetInput = Math.random() * 60;
    }

    setInterval(randomizeTargets, 2000);

    function loop() {
        if (!running) return;
        sidebar += (targetSidebar - sidebar) * 0.05;
        editor += (targetEditor - editor) * 0.05;
        input += (targetInput - input) * 0.05;
        window.setSidebarWidth(sidebar);
        window.setEditorWidth(editor);
        window.setInputHeight(input);
        requestAnimationFrame(loop);
    }
    loop();
    window.stopSatisfyingLayoutAnimation = () => { running = false; };
}
animateRandomSmooth();
````

---

> [!TIP]
> You can run one animation at a time. To stop any animation, execute:

```javascript
window.stopSatisfyingLayoutAnimation()
```
