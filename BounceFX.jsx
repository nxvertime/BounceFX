(function bounceUI(thisObj) {
  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Bounce FX", undefined, { resizeable: true });

    // Sliders
    win.ampGrp = win.add("group", undefined, "Amplitude Group");
    win.ampGrp.add("statictext", undefined, "Amplitude:");
    var ampSlider = win.ampGrp.add("slider", undefined, 0.05, 0, 1);
    var ampText = win.ampGrp.add("edittext", undefined, "0.05");
    ampText.characters = 5;

    win.freqGrp = win.add("group", undefined, "Frequency Group");
    win.freqGrp.add("statictext", undefined, "Frequency:");
    var freqSlider = win.freqGrp.add("slider", undefined, 4.0, 0, 10);
    var freqText = win.freqGrp.add("edittext", undefined, "4.0");
    freqText.characters = 5;

    win.decayGrp = win.add("group", undefined, "Decay Group");
    win.decayGrp.add("statictext", undefined, "Decay:");
    var decaySlider = win.decayGrp.add("slider", undefined, 8.0, 0, 20);
    var decayText = win.decayGrp.add("edittext", undefined, "8.0");
    decayText.characters = 5;

    // Slider syncing
    ampSlider.onChanging = function () {
      ampText.text = ampSlider.value.toFixed(2);
    };
    ampText.onChange = function () {
      ampSlider.value = parseFloat(ampText.text);
    };

    freqSlider.onChanging = function () {
      freqText.text = freqSlider.value.toFixed(2);
    };
    freqText.onChange = function () {
      freqSlider.value = parseFloat(freqText.text);
    };

    decaySlider.onChanging = function () {
      decayText.text = decaySlider.value.toFixed(2);
    };
    decayText.onChange = function () {
      decaySlider.value = parseFloat(decayText.text);
    };

    // Apply button
    win.btnGrp = win.add("group");
    var applyBtn = win.btnGrp.add("button", undefined, "Apply bouncing");

    applyBtn.onClick = function () {
      var amp = parseFloat(ampText.text);
      var freq = parseFloat(freqText.text);
      var decay = parseFloat(decayText.text);
      // Expression from https://www.motionscript.com/articles/bounce-and-overshoot.html
      var expression =
        "n = 0;\n" +
        "if (numKeys > 0){\n" +
        "  n = nearestKey(time).index;\n" +
        "  if (key(n).time > time){\n" +
        "    n--;\n" +
        "  }\n" +
        "}\n" +
        "if (n == 0){\n" +
        "  t = 0;\n" +
        "} else {\n" +
        "  t = time - key(n).time;\n" +
        "}\n" +
        "if (n > 0 && t < 1){\n" +
        "  v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n" +
        "  amp = " + amp + ";\n" +
        "  freq = " + freq + ";\n" +
        "  decay = " + decay + ";\n" +
        "  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n" +
        "} else {\n" +
        "  value;\n" +
        "}";

      var comp = app.project.activeItem;
      if (comp && comp instanceof CompItem) {
        var selectedProps = comp.selectedProperties;
        app.beginUndoGroup("Apply Bounce Expression");
        var count = 0;
        for (var i = 0; i < selectedProps.length; i++) {
          var prop = selectedProps[i];
          if (prop.canSetExpression) {
            prop.expression = expression;
            count++;
          }
        }
        app.endUndoGroup();
      } else {
        alert("Select a property in a composition !");
      }
    };

    // Signature
    win.signatureGrp = win.add("group");
    var sig = win.signatureGrp.add("statictext", undefined, "by c0ffeebabe <3"); // aka nxvertime / rockstarmade
    sig.alignment = "center";

    win.layout.layout(true);
    return win;
  }

  var myUI = buildUI(thisObj);
  if (myUI instanceof Window) {
    myUI.center();
    myUI.show();
  }
})(this);