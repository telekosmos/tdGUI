
Ext.define('TDGUI.controller.SearchPanel', {
	extend: 'Ext.app.Controller',
//	models: ['Target'],
//	stores: ['Targets'],
	views: ['panels.west.SearchPanel', 'panels.BorderCenter'],

	/*refs: [{
		ref: 'targetPanel',
		selector: 'TargetPanel'
	}, {
		ref: 'formView',
		selector: 'TargetByNameForm'
	}, {
		ref: 'submitButton',
		selector: '#TargetByNameSubmit_id'

	}],*/

	refs: [{
			ref: 'protLookup', // I get this.getProtLookup ()
			selector: 'tabpanel > panel > tdgui-conceptwiki-protein-lookup'
		}, {
			ref: 'examplesLabel', // I get this.getExamplesLabel
			selector: 'tabpanel > panel > label'
	  }, {
      ref: 'contentPanel',
      selector: 'viewport > tdgui-border-center'
    }, {
      ref: 'accTextarea',
      selector: 'tabpanel > panel > tdgui-textarea'
  }],



	init: function() {

console.info ('SearchPanel controller initializing... ')
		this.control({
			'TargetByNameForm button[action=query_target_by_name]': {
				click: this.submitQuery
			},

			'TargetByNameForm conceptWikiProteinLookup': {
				select: this.enableSubmit
			},

			'tdgui-west-search label': {
				click: this.labelClick // a window, tooltip or whatever has to be raised with ex
			},

			'tdgui-conceptwiki-protein-lookup': {
				focus: this.clickLookup
			},

      'tdgui-textarea': {
        click: this.textareaClick
      },

      'tdgui-panelbuttons > toolbar > button': { // see buttons on Panel
        click: this.retrieveBtnClick
      }


		});
	},


	clickLookup: function () {
		console.info ('*** focus on lookup')
	},

	onAfterRender: function () {
		console.info ('just onAfterRender')
	},


  retrieveBtnClick: function (btn, ev, opts) {
    var txtArea = btn.up ('tdgui-west-search').down ('tdgui-textarea')
    var uniprotIds = txtArea.getRawValue().split('\n').join(',')

    var me = this

    Ext.History.add('!p=MultiTarget&u=' + uniprotIds);

    if (btn.getId() == 'panelBtnLeft')
      txtArea.setValue('')

    Ext.Ajax.request({
      url: 'tdgui_proxy/multiple_entries_retrieval',
      method: 'GET',
      params: {
        entries: uniprotIds
      },

      success: function(response){
        var text = response.responseText
// console.info ("Got: "+text)
        var testPanel = Ext.widget ('panel', {
          title: 'Test Request',
          html: text,
          closable: true
        })
        me.getContentPanel().add (testPanel)
          // process server response here
      }
    });

// lo de abajo mejor iria en un método todo junto...

  },


	labelClick: function () {
		console.info ('SearchPanel.controller: got click event from label '+this.getExamplesLabel())
//						this.getExamplesLabel().setText ('Its ok'))
	},


  textareaClick: function () {
    console.info ('click event on textarea with content: '+this.getAccTextarea().getValue())
  },


	enableSubmit: function() {
		var form = this.getFormView();
		var button = this.getSubmitButton();
		button.enable();
	},


	submitQuery: function(button) {
		button.disable();
		var tp = this.getTargetPanel();
		tp.startLoading();

		var form = this.getFormView();
		var target_uri = form.getValues().protein_uri;

		Ext.History.add('TargetByNameForm=' + target_uri);
	}
});
