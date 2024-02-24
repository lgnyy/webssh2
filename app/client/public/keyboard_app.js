  const keyboardKeyCodeMapSpecial = {"{backspace}":8, "{tab}":9, "{enter}":13, "{space}":32, "{arrowleft}":37, "{arrowright}":39, "{arrowup}":38, "{arrowdown}":40};
  const keyboardKeyCodeMapList = [
    {start:48,  chars:")!@#$%^&*("}, 
    {start:186, chars:";=,-./`"}, 
    {start:186, chars:":+<_>?~"}, 
    {start:219, chars:"[\\]\'"}, 
    {start:219, chars:"{|}\""} 	
  ];
  function evaluateKeyboardEvent(kbEvent){
    if (kbEvent.key.length > 1){
      kbEvent.keyCode = keyboardKeyCodeMapSpecial[kbEvent.key];
      if (kbEvent.keyCode === 32){
        kbEvent.key = " ";
        kbEvent.charCode = 32;
      }else{
        kbEvent.key = "";
        kbEvent.charCode = 0;
      }
    }else{
      kbEvent.charCode = kbEvent.key.charCodeAt(0);
      if (((kbEvent.charCode >= 0x30) && (kbEvent.charCode <= 0x39)) || ((kbEvent.charCode >= 0x41) && (kbEvent.charCode <= 0x5A))){
        kbEvent.keyCode = kbEvent.charCode;
      }else if ((kbEvent.charCode >= 0x61) && (kbEvent.charCode <= 0x7A)){
        kbEvent.keyCode = kbEvent.charCode - 0x20;
      }else{
        for (let item of keyboardKeyCodeMapList){
          let pos = item.chars.indexOf(kbEvent.key);
          if (pos >= 0){
            kbEvent.keyCode = item.start + pos;
            break;
          }
        }
      }
    }
  }

  let keyboardEventInit = {};
  let keyboard = new SimpleKeyboard.SimpleKeyboard({
    onKeyPress: onKeyPress,
    layout: {
        default: [
          "` 1 2 3 4 5 6 7 8 9 0 - =",
          "{tab} q w e r t y u i o p [ ]",
          "{capslock} a s d f g h j k l ; '",
          "{shiftleft} z x c v b n m , . / \\",
          "{controlleft} {altleft} {arrowup} {space} {arrowdown} {backspace} {enter}"
        ],
        shift: [
          "~ ! @ # $ % ^ & * ( ) _ +",
          "{tab} Q W E R T Y U I O P { }",
          '{capslock} A S D F G H J K L : "',
          "{shiftright} Z X C V B N M < > ? |",
          "{controlright} {altright} {arrowleft} {space} {arrowright} {backspace} {enter}"
        ]
      },
      display: {
        "{tab}": "⇥",
        "{backspace}": "⌫",
        "{enter}": "Enter↵",
        "{space}": "␣",
        "{capslock}": "⇪",
        "{shiftleft}": "⇧",
        "{shiftright}": "⇧",
        "{controlleft}": "Ctrl",
        "{controlright}": "Ctrl",
        "{altleft}": "Alt",
        "{altright}": "Alt",
        "{arrowup}": "↑",
        "{arrowdown}": "↑",
        "{arrowleft}": "←",
        "{arrowright}": "→"
      }
  });

  function changeLayout(){
    const currentLayout = keyboard.options.layoutName;
    keyboard.setOptions({layoutName: currentLayout === "default" ? "shift" : "default"});
  }
  function onKeyPress(button) {
    console.log("Button pressed", button);

    if (button === "{capslock}"){
      changeLayout();
    }else if((button === "{shiftleft}") || (button === "{shiftright}")) {
      keyboard.options.onceshift = !keyboard.options.onceshift;
      changeLayout();
    }else if((button === "{controlleft}") || (button === "{controlright}")) {
      keyboardEventInit.ctrlKey = !keyboardEventInit.ctrlKey;
    }
    else if((button === "{altleft}") || (button === "{altright}")) {
      keyboardEventInit.altKey = !keyboardEventInit.altKey;
    }else {
      //keyboardEventInit.shiftKey = (keyboard.options.layoutName === "shift");
      keyboardEventInit.key = button;
      evaluateKeyboardEvent(keyboardEventInit);
      console.log("keyboardEventInit", keyboardEventInit);

      if (window.parent && window.parent.terminalKeyPress){
        window.parent.terminalKeyPress(keyboardEventInit);
      }

      if (keyboard.options.onceshift){
        keyboard.options.onceshift = false;
        changeLayout();
      }
      keyboardEventInit.ctrlKey = false;
      keyboardEventInit.altKey = false;
    }
  }
