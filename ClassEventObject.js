// SOME SUPPORT FUNCTIONS
function IsNull                 (ThisValue)          { return ((ThisValue === undefined) || (ThisValue === null) );}
function IsNotNull              (ThisValue)          { return ((ThisValue !== undefined) && (ThisValue !== null) );}

function IsFunction             (ThisCallBack)       { return ((typeof ThisCallBack === 'function')); } 
function IsArray                (ThisArray)          { return (IsNull(ThisArray))?false:Array.isArray(ThisArray);} 

function IsObject(ThisObj) {

  if(IsNull(ThisObj)){return false;}
  let IsTrue    =  (ThisObj === Object(ThisObj));

  if(IsTrue){
    if(IsArray(ThisObj)){return false;}
    if((typeof ThisObj) === 'function'){return false;}
    if((typeof ThisObj) === 'object'){
      return true;
    }
  }
  return false;
}


// NEW CLASS DCEventObject
class DCEventObject {

  constructor                           (ThisPrefix, ThisVarName) {

    if((IsNullString(ThisVarName))
    ){
      ThisVarName           = "ClassDCEventObject";
    }
    if((IsNullString(ThisPrefix))
    ){
      ThisPrefix            = "DCEvent_";
    }
    this.Prefix             = ThisPrefix;
    this.$VarName           = ThisVarName;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // EVENT SERVER PART
    ////////////////////////////////////////////////////////////////////////////////////////////////
    function CreateCustomEvent          (ThisName, TheseDetails, Bubbled, Cancelable, Composed){
      let TheseParameters             = {};
      if(IsNotNull(Bubbled))            { TheseParameters.bubbles      =  true; };
      if(IsNotNull(Cancelable))         { TheseParameters.cancelable   =  true; };
      if(IsNotNull(Composed))           { TheseParameters.composed     =  true; };
      if(IsNotNull(TheseDetails))       { TheseParameters.details      =  TheseDetails; };
      var ThisEvent                   = new CustomEvent(ThisName, TheseParameters);  // addEventListener('EventName', doSomething, false);
      return ThisEvent;
    }
    this.TriggerEvent                 = function (ThisName, TheseDetails, Bubbled, Cancelable, Composed){
      var ThisEvent                   = CreateCustomEvent  (this.Prefix + ThisName, TheseDetails, Bubbled, Cancelable, Composed);
      dispatchEvent(ThisEvent);  
      return ThisEvent; //  IN CASE YOU WANT TO CALL MULTIPLE TIMES
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // EVENT CLIENT PART
    ////////////////////////////////////////////////////////////////////////////////////////////////
    function CallBackObj                (ThisCallBack, ...args){
      function handleEvent(ThisEvent) {
        if(IsFunction(ThisCallBack)){ 
          ThisCallBack(ThisEvent, ...args);
        }
      }
      return {handleEvent : handleEvent};
    }
    // FOR YOUR OWN OBJECT
    this.OnObj                           = function (ThisName, ThisCallBackObj){
      if(IsObject(ThisCallBackObj)){ 
        addEventListener(this.Prefix + ThisName, ThisCallBackObj, false);
        return ThisCallBackObj;
      } else {
        return null;
      } 
    }
    this.On                           = function (ThisName, ThisCallBack, ...args){
      if(IsFunction(ThisCallBack)){ 
        let ThisCallBackObj           = new CallBackObj (ThisCallBack, ...args);
        addEventListener(this.Prefix + ThisName, ThisCallBackObj, false);
        console.log("Now, Returning a Event Handler Object to which you can delete easily. This is what should have been done at the root of JS.");
        return ThisCallBackObj;
      } else {
        return null;
      } 
    }
    this.Off                          = function (ThisName, ThisCallBackObj){
      if(IsObject(ThisCallBackObj)){ 
        removeEventListener(this.Prefix + ThisName, ThisCallBackObj, false);
        return true;
      } else {
        return false;
      } 
    }
    
  } // END OF CONSTRUCTOR
  // SEE HOW EASY IT IS, WHEN YOU KNOW WHAT YOU'RE DOING!? IT'S ALSO CLEAN & CRYSTAL CLEAR.
}
