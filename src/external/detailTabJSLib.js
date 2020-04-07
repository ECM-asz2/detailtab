!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory():"function"==typeof define&&define.amd?define("detailTabJSLib",[],factory):"object"==typeof exports?exports.detailTabJSLib=factory():root.detailTabJSLib=factory()}(this,function(){/******/
return function(modules){/******/
/******/
// The require function
/******/
function __webpack_require__(moduleId){/******/
/******/
// Check if module is in cache
/******/
if(installedModules[moduleId])/******/
return installedModules[moduleId].exports;/******/
// Create a new module (and put it into the cache)
/******/
var module=installedModules[moduleId]={/******/
i:moduleId,/******/
l:!1,/******/
exports:{}};/******/
/******/
// Return the exports of the module
/******/
/******/
/******/
// Execute the module function
/******/
/******/
/******/
// Flag the module as loaded
/******/
return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.l=!0,module.exports}// webpackBootstrap
/******/
// The module cache
/******/
var installedModules={};/******/
/******/
// Load entry module and return exports
/******/
/******/
/******/
/******/
// expose the modules object (__webpack_modules__)
/******/
/******/
/******/
// expose the module cache
/******/
/******/
/******/
// identity function for calling harmony imports with the correct context
/******/
/******/
/******/
// define getter function for harmony exports
/******/
/******/
/******/
// getDefaultExport function for compatibility with non-harmony modules
/******/
/******/
/******/
// Object.prototype.hasOwnProperty.call
/******/
/******/
/******/
// __webpack_public_path__
/******/
return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.i=function(value){return value},__webpack_require__.d=function(exports,name,getter){/******/
__webpack_require__.o(exports,name)||/******/
Object.defineProperty(exports,name,{/******/
configurable:!1,/******/
enumerable:!0,/******/
get:getter})},__webpack_require__.n=function(module){/******/
var getter=module&&module.__esModule?/******/
function(){return module.default}:/******/
function(){return module};/******/
/******/
return __webpack_require__.d(getter,"a",getter),getter},__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=3)}([/* 0 */
/***/
function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.Constants={CM_PRE_SAVE_ACTION_FOR_CURRENT_DETAIL_TAB:"cmPreSaveActionForCurrentDetailTab",CM_POST_SAVE_ACTION_FOR_CURRENT_DETAIL_TAB:"cmPostSaveActionForCurrentDetailTab"}},/* 1 */
/***/
function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.DetailTabContext="DETAILTAB",exports.DetailTabEvent={CHANGED:"detailTabChanged",DELETED:"detailTabDeleted",CREATED:"detailTabCreated",CM_CHANGED_DATA:"detailTabNewDataForYou",REGISTER_TAB_FOR_CM_PRE_SAVE:"registerTabForPreSaveFunctions",REGISTER_TAB_FOR_CM_POST_SAVE:"registerTabForPostSaveFunctions",TAB_CHANGED_DATA:"detailTabNewDataForCM",TAB_CHANGED_VISIBILITY:"detailTabNewTabVisibilityForCM",TAB_CHANGED_TITLE:"detailTabSetTitleForCM",GET_CM_DATA:"getCMData",RETURN_CM_DATA_TO_TAB:"returnCMDataBackToDetailTab"}},/* 2 */
/***/
function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var RetryPostMessage=function RetryPostMessage(){_classCallCheck(this,RetryPostMessage)};RetryPostMessage.MAX_TRIES=5,RetryPostMessage.recursiveSameOriginPostMessage=function(targettedWindow,context,eventType,data,counter){var error="";if(void 0!=context&&""!=context||(error="Cannot send a message to the target without a valid context!"),void 0!=eventType&&""!=eventType||(error="Cannot send a message to the target without a valid event type!"),void 0==targettedWindow&&(error="Cannot send a message. targettedWindow is null!"),void 0==targettedWindow.location&&(error="Cannot send a message. targettedWindow.location is null!"),void 0!=targettedWindow.location.origin&&"null"!==targettedWindow.location.origin||(error="Cannot send a message. targettedWindow.location.origin is null!"),""===error){var stringifiedObject=JSON.stringify({context:context,eventType:eventType,data:data},function(k,v){return void 0==v?null:v});console.log("Send post message",context,eventType,data),targettedWindow.postMessage(stringifiedObject,targettedWindow.location.origin)}else{if(!(counter<RetryPostMessage.MAX_TRIES))throw console.log("Could not send post message due to error:",error,"Throw error."),error;counter++,console.log("Could not send post message due to error:",error,"Try again in",100*counter,"ms"),setTimeout(function(){return RetryPostMessage.recursiveSameOriginPostMessage(targettedWindow,context,eventType,data,counter)},100*counter)}};exports.PostMessage=function PostMessage(){var _this=this;_classCallCheck(this,PostMessage),this.sameOriginPostMessage=function(targettedWindow,context,eventType,data){RetryPostMessage.recursiveSameOriginPostMessage(targettedWindow,context,eventType,data,0)},this.handleMessages=function(event){if(event.origin!==window.location.origin)return void console.log("Received untrusted message event, ignoring it.");var eventData={};void 0!=event.data&&"string"==typeof event.data&&(eventData=JSON.parse(event.data)),eventData.context===_this.postMsgContext&&_this.callbackWithData(eventData,event.source)},this.listenForMessages=function(targettedWindow,context,callbackWithData){_this.postMsgContext=context,_this.callbackWithData=callbackWithData,_this.targettedWindow=targettedWindow,_this.targettedWindow.addEventListener("message",_this.handleMessages,!1)},this.stopListeningForMessages=function(){_this.targettedWindow.removeEventListener("message",_this.handleMessages,!1)}}},/* 3 */
/***/
function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.DetailTabJSLib=void 0;var _PostMessage=__webpack_require__(2),_Events=__webpack_require__(1),_Constants=__webpack_require__(0),DetailTabHelperFunctions=function DetailTabHelperFunctions(){_classCallCheck(this,DetailTabHelperFunctions)};DetailTabHelperFunctions.filterMessagesByEventType=function(functionHandler,event,filteredEventType){event.eventType===filteredEventType&&functionHandler(event)},module.exports={DetailTabJSLib:exports.DetailTabJSLib=function DetailTabJSLib(){_classCallCheck(this,DetailTabJSLib),this.postMessage=new _PostMessage.PostMessage,this.registerForDataChange=function(functionHandler){console.debug("Detail tab registered for post message to handle case/contract data change events"),this.postMessage.listenForMessages(window,_Events.DetailTabContext,function(event){return DetailTabHelperFunctions.filterMessagesByEventType(functionHandler,event,_Events.DetailTabEvent.CM_CHANGED_DATA)}),this.callForData()},this.registerForPreSave=function(functionHandler){console.debug("Detail tab registered for post message to run a function just before a case will be saved",functionHandler),window[_Constants.Constants.CM_PRE_SAVE_ACTION_FOR_CURRENT_DETAIL_TAB]=functionHandler,this.postMessage.sameOriginPostMessage(parent,_Events.DetailTabContext,_Events.DetailTabEvent.REGISTER_TAB_FOR_CM_PRE_SAVE)},this.registerForPostSave=function(functionHandler){console.debug("Detail tab registered for post message to run a function after a case has been successfully saved",functionHandler),window[_Constants.Constants.CM_POST_SAVE_ACTION_FOR_CURRENT_DETAIL_TAB]=functionHandler,this.postMessage.sameOriginPostMessage(parent,_Events.DetailTabContext,_Events.DetailTabEvent.REGISTER_TAB_FOR_CM_POST_SAVE)},this.callForData=function(){console.debug("Detail tab sends post message for getting whole case/contract data object"),this.postMessage.sameOriginPostMessage(parent,_Events.DetailTabContext,_Events.DetailTabEvent.GET_CM_DATA)},this.setVisibilityOfTab=function(visibility){console.debug("Detail tab sends post message to change its visibility:",visibility),this.postMessage.sameOriginPostMessage(parent,_Events.DetailTabContext,_Events.DetailTabEvent.TAB_CHANGED_VISIBILITY,{visibility:visibility})},this.setTitle=function(title){console.debug("Detail tab sends post message to set its title:",title),this.postMessage.sameOriginPostMessage(parent,_Events.DetailTabContext,_Events.DetailTabEvent.TAB_CHANGED_TITLE,{title:title})},this.updateData=function(data){console.debug("Detail tab sends post message for case/contract data update:",data),this.postMessage.sameOriginPostMessage(parent,_Events.DetailTabContext,_Events.DetailTabEvent.TAB_CHANGED_DATA,data)}},DetailTabContext:_Events.DetailTabContext,DetailTabEvent:_Events.DetailTabEvent,PostMessage:_PostMessage.PostMessage,Constants:_Constants.Constants}}])});