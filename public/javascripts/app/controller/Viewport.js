

Ext.define ("TDGUI.controller.Viewport", {
  extend: 'Ext.app.Controller',

  views: ['Viewport', 'panels.BorderCenter', 'panels.MultiTarget'],
  stores: [],

  refs: [{
    ref: 'contentTabs',
    selector: 'tdgui-viewport > tdgui-border-center'
  }
  ],




  init: function () {
    var me = this
    Ext.History.init()

    Ext.History.on('change', function (token) {
console.info ('inside the History event handler')
       if (token) {
          me.handleHistoryToken(token);
       }
    }) // , this);

    this.control({
      'tdgui-viewport': {
        historyAdded: this.handleHistoryToken
      }

    })
  },


  onLaunch: function (app) {
  },


  handleHistoryToken: function (token) {
console.info ('*** CREATING NEW COMP @ Viewport controller.handleHistoryToken + '+token)

    var tabsPanel = this.getContentTabs()
    var tokenObj = this.parseHistoryToken(token)
    var xtype = tokenObj.xt
    var multiTarget = Ext.widget (xtype, {
      closable: true,
      gridParams: {entries: tokenObj.qp},
      title: "Multiple targets"
    })

    tabsPanel.add (multiTarget)
    tabsPanel.suspendEvents(false)
    tabsPanel.setActiveTab(multiTarget)
    tabsPanel.resumeEvents()
  },


/**
 * Parse a history-token string and returns an object such that its keys are
 * the name of the params and the values, the params values
 * @param stringToParse, the token history
 * @return {Object}
 */
  parseHistoryToken:function (stringToParse) {
    var obj = {};
    var andBits = stringToParse.split('&');

    Ext.each(andBits, function (bit) {
      var firstEquals = bit.indexOf('=');

      if (firstEquals != -1) {
        var startIndex = (bit.charAt(0) == '!')? 1: 0

        var key = bit.substring (startIndex, firstEquals);
        var value = bit.substring (firstEquals + 1, bit.length)
        obj[key] = value;
      }
    });
    return obj;
  }


})