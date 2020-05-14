/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","jquery","knockout","require","ojs/ojcontext","ojs/ojthemeutils","ojs/ojtranslation","hammerjs","ojs/ojcomposite","ojs/ojcomponentcore","ojs/ojanimation","ojs/ojconverterutils","ojs/ojconverterutils-i18n","ojs/ojlogger","ojs/ojjquery-hammer","ojs/ojknockout","ojs/ojbutton"],function(e,t,o,i,s,n,a,r,p,d,u,l,c,m){"use strict";function h(e){this._composite=e.element,this.containerId=[e.unique,"mc"].join("_"),this._messagesContainerId=this.containerId,this.handleCloseIcon=this._handleCloseIcon.bind(this),this.close=this._closeMessage.bind(this),this.bindingsApplied=this._bindingsApplied.bind(this),this.disconnected=this._disconnected.bind(this),this.connected=this._connected.bind(this),this.propertyChanged=this._propertyChanged.bind(this),this.messageCreatedTime=(new Date).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),this.handleKeydown=this._handleKeydown.bind(this),this._properties=e.properties,this._createObservables()}function g(e,t){this._element=e,this._operation=t,this._init()}h.prototype._connected=function(e){var t=this._operationMediator;t&&"none"===t.getPendingOperation()&&this._isMessageOpen()&&this._scheduleAutoClose()},h.prototype._disconnected=function(e){var t=this._operationMediator;t&&"none"===t.getPendingOperation()&&this._clearAutoClose()},h.prototype._bindingsApplied=function(e){this._openMessage()},h.prototype._propertyChanged=function(e){function t(e,t,o){if("external"===e.updatedFrom&&e.property===t){var i=e.subproperty;if(i)return[t,o].join(".")===i.path;var s=e.previousValue[o];return e.value[o]!==s}return!1}t(e,"message","autoTimeout")&&(this.computedMessageCloseSelectors(this._computeMessageCloseSelectors()),this._clearAutoClose(),this._scheduleAutoClose()),t(e,"message","closeAffordance")&&(this.hasCloseAffordance("defaults"===this._computeCloseAffordance()),this._unregisterSwipeHandler(),this._registerSwipeHandler()),t(e,"message","icon")&&(this.computedIconStyle(this._computeIconStyle()),this.computedIconClass(this._computeIconClass())),(t(e,"message","category")||t(e,"displayOptions","category"))&&this.computedCategory(this._computeCategory()),t(e,"message","severity")&&(this.computedSeverity(this._computeSeverity()),this.computedCategory(this._computeCategory()),this.computedIconClass(this._computeIconClass())),t(e,"message","timestamp")&&this.formattedTimestamp(this._formatTimestamp()),t(e,"message","summary")&&this.computedSummary(this._computeSummary()),t(e,"message","detail")&&this.computedDetail(this._computeDetail()),t(e,"translations","labelCloseIcon")&&this.computedLabelCloseIcon(this._computeLabelCloseIcon()),t(e,"translations","categories")&&this.computedCategory(this._computeCategory())},h.prototype._registerSwipeHandler=function(){if(e.DomUtils.isTouchSupported()&&"defaults"===this._computeCloseAffordance()){var o=t(document.getElementById(this._messagesContainerId)),i={recognizers:[[r.Swipe,{direction:r.DIRECTION_ALL}]]},s="rtl"===e.DomUtils.getReadingDirection()?"swipeleft swipeup":"swiperight swipeup";this._hammerSwipe=o.ojHammer(i).on(s,function(e){e.preventDefault(),this._closeMessage()}.bind(this))}},h.prototype._unregisterSwipeHandler=function(){if(e.DomUtils.isTouchSupported()&&this._hammerSwipe){var t="rtl"===e.DomUtils.getReadingDirection()?"swipeleft swipeup":"swiperight swipeup";this._hammerSwipe.off(t),delete this._hammerSwipe}},h.prototype._scheduleAutoClose=function(){this._computeAutoTimeout()>-1&&(this._autoCloseTimer=window.setTimeout(this._closeMessage.bind(this),this._computeAutoTimeout()))},h.prototype._clearAutoClose=function(){isNaN(this._autoCloseTimer)||(window.clearTimeout(this._autoCloseTimer),delete this._autoCloseTimer)},h.prototype._isMessageOpen=function(){var e=document.getElementById(this._messagesContainerId);return!(!e||!t(e).is(":visible"))},h.prototype._closeMessage=function(e){var o=document.getElementById(this._messagesContainerId);if(o){this._unregisterSwipeHandler(),this._clearAutoClose();var i=this._operationMediator;if(i){if(i.isOperationPending("close",this._closeMessage.bind(this,e)))return;i.destroy()}this._operationMediator=new g(this._composite,"close");var s=this._getAnimateOptionDefaults("close");u.startAnimation(o,"close",s,this._composite).then(function(){t(o).hide(),d.subtreeHidden(o);var i={bubbles:!0,cancelable:!1,detail:{message:this._properties.message}},s=new CustomEvent("ojClose",i);e&&Object.defineProperty(s,"_originalEvent",{value:e,writable:!1}),this._composite.dispatchEvent(s)}.bind(this))}},h.prototype._computeSeverity=function(){var t=this._properties.message;return e.StringUtils.isEmptyOrUndefined(t.severity)?h._getMessageDefault("severity"):"fatal"===t.severity?"error":t.severity},h.prototype._formatTimestamp=function(){var t=this._properties.message;if(!e.StringUtils.isEmptyOrUndefined(t.timestamp)){var o=s.getContext(this._composite).getBusyContext().addBusyState({description:"oj-message is busy loading required libraries and processing timestamp"});this._getConverterPromise(t.timestamp).then(function(e){try{var i=e.format(t.timestamp);this.formattedTimestamp(i)}catch(e){m.info(["JET oj-message id='",h._toSelector(this._composite),"': failed to parse or format the supplied value to message.timestamp='",t.timestamp,"'."].join(""))}finally{o()}}.bind(this))}},h.prototype._getConverterPromise=function(t){var o=e.__getRequirePromise("ojs/ojconverter-datetime",i);return o||m.warning(["JET oj-message id='",h._toSelector(this._composite),"': failed to parse message.timestamp='",t,"' because require() is not available"].join("")),o.then(function(e){var o=this._isDateToday(t)?"hh:mm a":"MM/dd/yy, hh:mm a";return new e.IntlDateTimeConverter({pattern:o})}.bind(this))},h.prototype._isDateToday=function(e){var t=new Date,o=new Date(e);return t.getUTCFullYear()===o.getUTCFullYear()&&t.getUTCMonth()===o.getUTCMonth()&&t.getUTCDate()===o.getUTCDate()},h.prototype._computeCategory=function(){var t=this._properties.displayOptions;if(!t||!t.category||"none"!==t.category){var o=this._properties.message;if(!e.StringUtils.isEmptyOrUndefined(o.category))return o.category;var i=this._computeSeverity(),s=this._properties.translations,n=s&&s.categories?s.categories[i]:"";return e.StringUtils.isEmptyOrUndefined(n)&&(n=a.getComponentTranslations("oj-ojMessage").categories[i]),n}},h.prototype._computeAutoTimeout=function(){var e=this._properties.message;return isNaN(e.autoTimeout)?h._getMessageDefault("autoTimeout"):0===e.autoTimeout?this._getThemedAutoTimeoutDefault():e.autoTimeout},h.prototype._computeIconStyle=function(){var t=this._properties.message;if(!e.StringUtils.isEmptyOrUndefined(t.icon))return["url('",t.icon,"') no-repeat"].join("")},h.prototype._computeIconClass=function(){var t=this._properties.message;if(e.StringUtils.isEmptyOrUndefined(t.icon)){var o=this._computeSeverity();if("none"!==o){var i=["oj-component-icon","oj-message-status-icon"];return i.push(["oj","message",o,"icon"].join("-")),i.join(" ")}}},h.prototype._computeCloseAffordance=function(){var t=this._properties.message;return e.StringUtils.isEmptyOrUndefined(t.closeAffordance)?h._getMessageDefault("closeAffordance"):t.closeAffordance},h.prototype._computeMessageCloseSelectors=function(){return this._computeAutoTimeout()>-1?"oj-message-close oj-message-auto-timeout-close":"oj-message-close"},h.prototype._computeSound=function(){var e=this._properties.message;return void 0===e.sound?h._getMessageDefault("sound"):e.sound},h.prototype._computeLabelCloseIcon=function(){var t=this._properties.translations;return e.StringUtils.isEmptyOrUndefined(t.labelCloseIcon)?a.getTranslatedString("oj-ojMessage.labelCloseIcon"):t.labelCloseIcon},h.prototype._computeSummary=function(){var t=this._properties.message;if(!e.StringUtils.isEmptyOrUndefined(t.summary))return t.summary},h.prototype._computeDetail=function(){var t=this._properties.message;if(!e.StringUtils.isEmptyOrUndefined(t.detail))return t.detail},h.prototype._handleCloseIcon=function(e){this._closeMessage(e)},h.prototype._openMessage=function(){var e=document.getElementById(this._messagesContainerId);if(e)if(this._isInlinedChildOfOjMessages())this._prepareMessageAtOpen();else{this._operationMediator=new g(this._composite,"open");var t={bubbles:!0,cancelable:!1,detail:{message:this._properties.message}};this._composite.dispatchEvent(new CustomEvent("ojBeforeOpen",t));var o=this._getAnimateOptionDefaults("open");u.startAnimation(e,"open",o,this._composite).then(function(){t={bubbles:!0,cancelable:!1,detail:{message:this._properties.message}},this._prepareMessageAtOpen(),this._composite.dispatchEvent(new CustomEvent("ojOpen",t))}.bind(this))}},h.prototype._isInlinedChildOfOjMessages=function(){var e=this._findMessagesAncestor();return e&&!e.getProperty("messages")},h.prototype._findMessagesAncestor=function(){for(var e=this._composite.parentElement;e;e=e.parentElement)if(e.nodeName.startsWith("OJ-"))return"OJ-MESSAGES"===e.nodeName?e:null;return null},h.prototype._prepareMessageAtOpen=function(){var e=this._computeSound();"none"!==e&&(this._initAudioContext(),this._playSound(e)),this._registerSwipeHandler(),this._scheduleAutoClose()},h.prototype._handleKeydown=function(e){e.defaultPrevented||"defaults"!==this._computeCloseAffordance()||e.keyCode===t.ui.keyCode.ESCAPE&&(e.preventDefault(),this._closeMessage(e))},h.prototype._playSound=function(e){if("defaults"!==e){var t=document.createElement("AUDIO");t.src=e,t.addEventListener("error",function(){m.info(["JET oj-message id='",h._toSelector(this._composite),"': failed to load or play media file for URL in property message.sound='",e,"'."].join(""))}.bind(this));var o=t.play();void 0!==o&&o.then(function(){}).catch(function(t){m.info(["JET oj-message id='",h._toSelector(this._composite),"': failed to load or play specified sound: '",e,"': error details: '",t].join(""))}.bind(this))}else if(void 0===window.audioContext)m.info(["JET oj-message id='",h._toSelector(this._composite),"': failed to load or play default sound for message because user agent does\n","not support Web Audio API'"].join(""));else{var i=window.audioContext.createGain();i.connect(window.audioContext.destination);var s=window.audioContext.createOscillator();s.connect(i),s.start(),s.stop(window.audioContext.currentTime+.01)}},h.prototype._initAudioContext=function(){if(void 0===window.audioContext)try{window.audioContext=new(window.AudioContext||window.webkitAudioContext)}catch(e){}},h.prototype._createObservables=function(){this.hasCloseAffordance=o.observable("defaults"===this._computeCloseAffordance()),this.computedIconStyle=o.observable(this._computeIconStyle()),this.computedIconClass=o.observable(this._computeIconClass()),this.computedSeverity=o.observable(this._computeSeverity()),this.computedCategory=o.observable(this._computeCategory()),this.formattedTimestamp=o.observable(this._formatTimestamp()),this.computedLabelCloseIcon=o.observable(this._computeLabelCloseIcon()),this.computedMessageCloseSelectors=o.observable(this._computeMessageCloseSelectors()),this.computedSummary=o.observable(this._computeSummary()),this.computedDetail=o.observable(this._computeDetail())},h._getMessageDefault=function(e){return h._DEFAULTS.message[e]},h._DEFAULTS={autoTimeout:4e3,animation:{open:{effect:"fadeIn",duration:"300ms"},close:{effect:"fadeOut",duration:"300ms"}},message:{severity:"none",autoTimeout:-1,closeAffordance:"defaults",sound:"none"}},h.prototype._getThemedAutoTimeoutDefault=function(){var e=n.parseJSONFromFontFamily("oj-message-option-defaults");return e&&e.autoTimeout?e.autoTimeout:h._DEFAULTS.autoTimeout},h.prototype._getAnimateOptionDefaults=function(e){return h._DEFAULTS.animation[e]},h._toSelector=function(e){var t="";if(e)if(e.id&&e.id.length>0)t="#"+e.id;else{t=e.nodeName;var o=e.getAttribute("class");if(o&&(t+="."+o.split(" ").join(".")),e.parentNode)return h._toSelector(e.parentNode)+" > "+t}return t},g.prototype._init=function(){this._resolvedQueue=[],this._callback=this._eventHandler.bind(this);var e=this._operation,t=["oj"];t.push(e.charAt(0).toUpperCase()),t.push(e.slice(1));var o=t.join("");this._eventType=o,this._element.addEventListener(o,this._callback);var i=s.getContext(this._element).getBusyContext(),n={description:this._getBusyStateDescription.bind(this,this._element,this._operation)},a=i.addBusyState(n);this.addPromiseExecutor(function(e){window.setImmediate(function(){e()})}.bind(this,a))},g.prototype._getBusyStateDescription=function(e,t){return[e.nodeName," identified by '",h._toSelector(e),"' is busy animating on the '",t,"' operation."].join("")},g.prototype._deliverResolved=function(e){var t=this._resolvedQueue;this._resolvedQueue=[],e=e||this._operation,this._operation=null;for(var o=0;o<t.length;o++)t[o](e)},g.prototype.destroy=function(){this._deliverResolved("none"),this._callback=null,this._element=null,this._operation=null,this._eventType=null},g.prototype._eventHandler=function(e){e.target===this._element&&(this._element.removeEventListener(e.type,this._callback),this._deliverResolved(),this._callback=null)},g.prototype.getPendingOperation=function(){return this._operation?this._operation:"none"},g.prototype.addPromiseExecutor=function(e,t){this._resolvedQueue.push(e)},g.prototype.isOperationPending=function(e,t){if(!this._element)return!1;var o=!1,i=this.getPendingOperation();return e===i?(m.info(["An oj-message id='",h._toSelector(this._element),"' invoked a '",e,"' operation while pending animation of the same type of operation. ","The second request will be ignored."].join("")),o=!0):"none"!==i&&(m.info(["An oj-message id='",h._toSelector(this._element),"' invoked a '",e,"' operation while pending animation of a '",i,"' operation. The second request will be invoked after the pending ","operation completes."].join("")),this.addPromiseExecutor(t),o=!0),o},p.register("oj-message",{view:'<div :id="[[containerId]]" class="oj-message-container" on-keydown="[[handleKeydown]]">  <div class="oj-message-header">    <div class="oj-message-leading-header" :title="[[computedCategory]]">      <oj-bind-if test="[[computedIconStyle]]">        <div class="oj-component-icon oj-message-status-icon oj-message-custom-icon"          role="presentation" :title="[[computedCategory]]"          :style.background="[[computedIconStyle]]">        </div>      </oj-bind-if>      <oj-bind-if test="[[computedIconClass]]">        <div role="presentation" :title="[[computedCategory]]" :class="[[computedIconClass]]">        </div>      </oj-bind-if>      <oj-bind-if test="[[computedCategory]]">        <div class="oj-message-category" tabindex="-1">          <h1 :title="[[computedCategory]]">            <oj-bind-text value="[[computedCategory]]"></oj-bind-text>           </h1>        </div>      </oj-bind-if>      <oj-bind-if test="[[!computedCategory() && computedSummary()]]">        <div class="oj-message-summary">          <oj-bind-text value="[[computedSummary]]"></oj-bind-text>        </div>      </oj-bind-if>    </div>    <div class="oj-message-trailing-header">      <oj-bind-if test="[[formattedTimestamp]]">        <div class="oj-message-timestamp">          <oj-bind-text value="[[formattedTimestamp]]"></oj-bind-text>         </div>      </oj-bind-if>      <oj-bind-if test="[[hasCloseAffordance]]">        <div :class="[[computedMessageCloseSelectors]]">          <oj-button display="icons" chroming="half" on-click="[[handleCloseIcon]]">            <span slot="startIcon" class="oj-fwk-icon oj-fwk-icon-cross"></span>            <span>              <oj-bind-text value="[[computedLabelCloseIcon]]"></oj-bind-text>            </span>          </oj-button>        </div>      </oj-bind-if>    </div>    </div>  <div class="oj-message-body">    <oj-bind-if test="[[computedCategory]]">      <div class="oj-message-summary">        <oj-bind-text value="[[computedSummary]]"></oj-bind-text>      </div>    </oj-bind-if>    <div class="oj-message-detail">      <oj-bind-slot name="detail">        <oj-bind-text value="[[computedDetail]]"></oj-bind-text>      </oj-bind-slot>    </div>  <div></div>',viewModel:h,metadata:{properties:{displayOptions:{type:"object",properties:{category:{type:"string",enumValues:["auto","header","none"],value:"auto"}}},message:{type:"object",properties:{autoTimeout:{type:"number",value:-1},category:{type:"string",value:""},closeAffordance:{type:"string",enumValues:["defaults","none"],value:"defaults"},detail:{type:"string",value:""},icon:{type:"string",value:""},severity:{type:"string",enumValues:["confirmation","error","info","none","warning"],value:"none"},sound:{type:"string",value:"none"},summary:{type:"string",value:""},timestamp:{type:"string",value:""}}},translations:{type:"object",value:{},properties:{categories:{type:"object",properties:{confirmation:{type:"string"},error:{type:"string"},info:{type:"string"},warning:{type:"string"}}},labelCloseIcon:{type:"string"}}}},methods:{close:{},setProperty:{},getProperty:{},setProperties:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojClose:{}},extension:{}}})});