/**
 * @class TDGUI.view.panels.TargetInfo
 * @extend Ext.panel.Panel
 * @alias widget.tdgui-targetinfopanel
 *
 * This is the entire 'Target by name' panel. Displays information about the
 * chosen target
 */
Ext.define('TDGUI.view.panels.TargetInfo', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-targetinfopanel',
  requires: ['TDGUI.store.lda.TargetStore', 'HT.lib.Util', 'TDGUI.view.misc.InteractionsForm'],
  
	title: 'Target Info',

  /**
   * @cfg {String} anchor the properties for the anchor layout
   */
	anchor: '100% 100%',
	autoScroll: true,
	bodyPadding: '10px',
	layout: 'anchor',

  /**
   * @cfg {Object} targetInfoStore this is intended to be an store where store
   * the properties for this target
   */
  targetInfoStore: null,

	/**
	 * Holds the data from the record retrieved!!
	 */
	recordData: undefined,

// This config is used to count the numbers of requests in order to fill this
// component with data.
// As by 07.2012, only there will be two sources (coreAPI and uniprot) but
// this is here in the case of we can add more in the future (chembl, f.ex.)
// The requested URIs are in the queryParam config property
  numOfReqs: 0,

/**
 * @cfg {String} concept_uuid this is a necessary config, got from the multitarget
 * component, in order to be able to set the pharma_button with the necessary parameters
 * to get pharmacological info from coreAPI / LDA
 */
  concept_uuid: undefined,

  /**
   * @cfg {String} uniprot_acc And this is necessary in order to perform the target interactions operation
   */
  uniprot_acc: undefined,

	initComponent: function() {
// set concept_uuid and uniprot_acc from
// "http://www.conceptwiki.org/concept/ec79efff-65cb-45b1-a9f5-dddfc1c4025c,http://www.uniprot.org/uniprot/Q14596"
    var qparams = this.queryParam.split(',');
    this.uniprot_acc = qparams[1].substring(qparams[1].lastIndexOf('/')+1, qparams[1].length);
    this.concept_uuid = qparams[0].substring(qparams[0].lastIndexOf('/')+1, qparams[0].length);

		this.privates.target_name_provenance = false;

    var me = this;
		this.items = [{
			xtype: 'panel',
			border: 0,
			layout: 'anchor',
			autoScroll: true,
			itemId: 'dp',
			bodyPadding: '10px',
			cls: 'target-data-panel',
			hidden: true,

			items: [{
				xtype: 'panel',
				border: 0,
				anchor: '100%',
				itemId: 'topPanel',
				layout: 'column',
				autoScroll: true,

				items: [{
					xtype: 'image',
					itemId: 'target_image',
					width: 150,
					height: 150,
					src: '/images/target_placeholder.png'
				}, {
					xtype: 'panel',
					bodyPadding: 30,
					columnWidth: 1.0,
					border: 0,
					autoScroll: true,
					itemId: 'textDataPanel',
					layout: 'anchor',

					items: [{
						xtype: 'displayfield',
						anchor: '100%',
//						itemId: 'target_name',
            itemId: 'prefLabel',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						fieldCls: 'target-title'
					}, {
						xtype: 'checkbox',
						boxLabel: 'Provenance',
						itemId: 'chkProvenance'
						// cls: 'target-field-label'
					}, {
            xtype:'button',
            text:'Pharmacology Data',
            itemId:'pharmTargetButton',
            cls:'target-pharm-button'
          }, {
            xtype:'button',
            text:'Interactions Data',
            itemId:'stringdbTargetButton',
            cls:'target-pharm-button',
            handler: this.raiseInteractionParams
          },
           /*{
            xtype:'button',
            text:'Pathway Data',
            itemId:'pathwayTargetButton',
            cls:'target-pharm-button',
            disabled: true
          }, */ {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'target_type',
						fieldLabel: 'Target Type',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						cls: 'target-field-label',
            hidden: true

					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'organism',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						fieldLabel: 'Organism',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'description',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						fieldLabel: 'Description',
						cls: 'target-field-label',
            hidden: true
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'synonyms',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						fieldLabel: 'Synonyms',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'specific_function',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						fieldLabel: 'Specific Function',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'cellular_location',
						fieldLabel: 'Cellular Location(s)',
						renderer: this.privates.provenanceTargetSummaryRenderer,
//            itemId: 'cellular_function',
//            fieldLabel: 'Cellular Function',
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'keywords',
						fieldLabel: 'Keywords',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						cls: 'target-field-label'
					}, {
						xtype: 'displayfield',
						anchor: '100%',
						itemId: 'pdb_id_page',
						fieldLabel: 'PDB Entry',
						renderer: this.privates.provenanceTargetSummaryRenderer,
						cls: 'target-field-label'
					}, {
						xtype: 'panel',
						border: 0,
						anchor: '100%',
						itemId: 'numericDataPanel',
						layout: 'column',
						bodyPadding: 30,

						items: [{
							xtype: 'displayfield',
							itemId: 'molecular_weight',
							columnWidth: 0.33,
							fieldLabel: 'Molecular Weight',
							renderer: this.privates.provenanceTargetSummaryRenderer,
							cls: 'target-field-bottom',
							fieldCls: 'target-field-bottom-field',
							labelAlign: 'top',
              hidden: true
						}, {
							xtype: 'displayfield',
							itemId: 'number_of_residues',
							columnWidth: 0.33,
							fieldLabel: 'Number of Residues',
							renderer: this.privates.provenanceTargetSummaryRenderer,
							cls: 'target-field-bottom',
							fieldCls: 'target-field-bottom-field',
							labelAlign: 'top',
              hidden: true
						}, {
							xtype: 'displayfield',
							itemId: 'theoretical_pi',
							columnWidth: 0.33,
							fieldLabel: 'Theoretical Pi',
							renderer: this.privates.provenanceTargetSummaryRenderer,
							cls: 'target-field-bottom',
							fieldCls: 'target-field-bottom-field',
							labelAlign: 'top',
              hidden: true
						}]
					}]
				}

				]
			}]
		}, {
			xtype: 'displayfield',
			border: 0,
			padding: '20px',
			itemId: 'msg',
			//                anchor:'100% 100%',
			region: 'center',
			hidden: true,
			fieldCls: 'target-message',
			value: 'message here'
		}];


    this.title = window.decodeURI(this.title)

// *** Store initialization:
// Mind the name of the fields in the store are the same than the names of the
// displayfields in here!!!!
//		var store = Ext.data.StoreManager.lookup('Targets');
//    var store = Ext.create ('TDGUI.store.Targets');
    var store = Ext.create ('TDGUI.store.lda.TargetStore');
    this.targetInfoStore = store;
//		store.addListener('load', this.showData, this);
    this.targetInfoStore.addListener('load', this.showData, this); // load is in TargetInfo controller:afterrender
//    this.targetInfoStore.addListener('load', this.displayData, this);
		this.callParent(arguments);
	},
	// EO initComponent


  /**
   * Display a dialog requesting for parameters for yielding the interaction network
   * (specifically interaction confidence value and max number of nodes)
   * @param {Ext.Component} btn the component source of the event (specifically a button)
   * @param {Event} ev the event information
   */
  raiseInteractionParams: function (btn, ev) {
    var panel = btn.up('tdgui-targetinfopanel');

    var me = panel;
    console.info('accession for targetinfo-panel: '+me.uniprot_acc);

		var textDataPanel = this.up('panel');
		var targetTitle = textDataPanel.items.getAt(0).getRawValue();

		var form = Ext.create('TDGUI.view.misc.InteractionsForm', {
			uniprot_acc: me.uniprot_acc,
			targetTitle: targetTitle
		});
		var interactionDlgId = 'interactionsDlg';
/*		var myInteractionsDlg = Ext.getCmp(interactionDlgId);
		if (myInteractionsDlg !== undefined && this.interactionDlg === undefined)
			this.interactionDlg = myInteractionsDlg;

		else if (this.interactionDlg === undefined) {
*/
			this.interactionDlg = Ext.widget('window', {
				title: 'Interactions parameters',
				closeAction: 'destroy',
				id: interactionDlgId,
				width: 250,
				height: 150,
	//      height: 400,
	//      minHeight: 400,
				layout: 'fit',
				resizable: true,
				modal: true,
				items: form
			});

    this.interactionDlg.show()

  },


  /**
   * Reset all display fields (where target information is displayed). This is
   * done in order to set information for a different target than the current one
   * @deprecated No longer useful as different target information is displayed in different tabs
   */
	resetAllFields: function() {
		var displayFields = this.query('displayfield');
		Ext.each(displayFields, function(field) {
			field.hide();
		}, this);
		var img = this.down('#target_image');
		img.setSrc('images/target_placeholder.png');
		this.doLayout();
	},



	showMessage: function(message) {
		var dp = this.down('#dp');
		var msg = this.down('#msg');

		dp.setVisible(false);
		msg.setValue(message);
		msg.setVisible(true);
	},


  /**
   * Set the data for the current target on the right display fields. This is usually
   * a callback method for some store event (as onload event, i.e.)
   * @param {Ext.data.Store} store the store where the data is to be retrieved
   * @param {Array} records the records of teh store as a Ext.data.Model array
   * @param {Boolean} successful
   * @deprecated just used at coreGUI application, not in TDGUI
   */
  displayData:function (store, records, successful) {
    if (successful) { // not necessary after LDA-> && records[0].data.hasOwnProperty('target_name')) {
//      if (records.length > 0) {
      var dp = this.down('#dp');
      var msg = this.down('#msg');
      msg.setVisible(false);
      this.setValues(store.first());
      dp.setVisible(true);
      /*      }
       else
       this.showMessage('No records found within OPS for this search');
       */
    }
    else {
//			this.showMessage('Server did not respond');
      var prevReq = store.proxy.extraParams.protein_uri
      var nextReq = this.queryParam.split(',')
      if (nextReq.length > 1 && nextReq != prevReq) {
        this.numOfReqs++
        this.fireEvent('opsFailed', this, {concept_req: nextReq[this.numOfReqs]})
      }
      // else raise a message with no information found...
    }

    this.endLoading();
// var targetInfos = Ext.ComponentQuery.query('tdgui-targetinfopanel')
// console.info ("targetinfos length: "+targetInfos.length)

  },


  /**
   * Show data as the #displayData method
   * @param store
   * @param records
   * @param successful
   */
  showData: function (store, records, successful) {
  	var me = this;

    if (successful) {
      var td = store.first().data;
      // As we resort to uniprot uri to get target info,
      // we have to get the actual concept_uuid
      if (records.length > 0 && td.hasOwnProperty('prefLabel')) { // TEMP FIX -- new coreAPI's returning an empty object
        var targetInfoURI = '/ops_api_calls/protein_info?protein_uri='+td.cw_target_uri;

      	Ext.Ajax.request({
      		url: targetInfoURI,

      		failure: function (resp, opts) {
      			me.endLoading();
      		},

      		success: function (resp, opts) {
      			var jsonObj = resp.responseText;
      			jsonObj = JSON.parse(jsonObj);
      			var primaryTopic = jsonObj.result.primaryTopic;
      			var rec = store.first();
      			var drugBankData = null;
      			Ext.each(primaryTopic.exactMatch, function (match, index, list) {
      				if (match['_about'] != undefined && match['_about'].indexOf('drugbank') != -1) {
      					drugBankData = match;
      					return false;
      				}
      			});

      			var c_uuid = primaryTopic._about.lastIndexOf('/');
      			me.concept_uuid = primaryTopic._about.substr(c_uuid+1, primaryTopic._about.length);
						var matches = primaryTopic.exactMatch;
						var cellLocation = null;
						Ext.each(matches, function (match, index, list) {
							if (match.cellularLocation != undefined) {
								if (match.cellularLocation instanceof String)
									cellLocation = match.cellularLocation;
								else
									cellLocation = match.cellularLocation.join(', ');

								return false;
							}
						});

						var drugbankLinkOut = 'http://www.drugbank.ca/molecules/';

      			if (drugBankData != null) {
							var drugBank_src = drugBankData[TDGUI.util.LDAConstants.LDA_IN_DATASET];
							var drugbankUri = drugBankData[TDGUI.util.LDAConstants.LDA_ABOUT];
							drugbankLinkOut += drugbankUri.split('/').pop() + '?as=target';
	      			rec.set({
	      				cw_target_uri: primaryTopic._about,
	      				molecular_weight: drugBankData['molecularWeight'],
								molecular_weight_src: drugBank_src,
								molecular_weight_item: drugbankLinkOut,
	      				number_of_residues: drugBankData != null ? drugBankData['numberOfResidues'] : null,
								number_of_residues_src: drugBank_src,
								number_of_residues_item: drugbankLinkOut,
	      				theoretical_pi: drugBankData != null ? drugBankData['theoreticalPi'] : null,
								theoretical_pi_src: drugBank_src,
								theoretical_pi_item: drugbankLinkOut,
								cellular_location: cellLocation,
								cellular_location_src: drugBank_src,
								cellular_location_item: drugbankLinkOut
	      			});
	      		}
      			var dp = me.down('#dp');
			      var msg = me.down('#msg');
			      msg.setVisible(false);
			      me.setValues(rec);
			      dp.setVisible(true);

			      me.endLoading();
      		} // success
      	}); // EO JSONP request
/*
        var dp = this.down('#dp');
        var msg = this.down('#msg');
        msg.setVisible(false);
        this.setValues(store.first());
        dp.setVisible(true);
*/
      }
      else {
        this.showMessage('No records found within OPS for this search');
        this.endLoading();
      }
//      this.endLoading();
    }
    else { // no success...
    	// try uniprot_by_acc
    	// var url = "http://"+TDGUI.Globals.theServer+":"+TDGUI.Globals.thePort+"/api/target/"+this.uniprot_acc+".jsonp";
    	var url = "http://"+TDGUI.Globals.Host+"/api/target/"+this.uniprot_acc+".jsonp";
    	Ext.data.JsonP.request({
    		url: url,

    		failure: function (resp, opts) {
					me.showMessage ('Unable to get information for protein with accession '+me.uniprot_acc);
					me.endLoading();
				},

				// In this case, we just check if the gene names match
				success: function (resp, opts) {
					var jsonObj = resp;

					if (jsonObj == null)
						me.showMessage ('Unable to get iformation for protein with accession '+me.uniprot_acc);
					else {
						var dp = me.down('#dp');
		        var msg = me.down('#msg');
		        msg.setVisible(false);
		        // me.setValues(jsonObj);
		        var pharmButton = me.down('#pharmTargetButton');
		        pharmButton.disable();
		        dp.setVisible(true);

		        me.addSynonyms(jsonObj.genes);
				    me.addOrganism(jsonObj.organismSciName);
						me.addPDBImage(jsonObj.pdbimg);

						var specFuncField = me.down('#specific_function');
						specFuncField.setValue(jsonObj.function);
						specFuncField.show();
						specFuncField.setVisible(true);

						var labelFuncField = me.down('#prefLabel');
						labelFuncField.setValue(jsonObj.proteinFullName);
						labelFuncField.show();
						labelFuncField.setVisible(true);

						me.addPDBImage(jsonObj.pdbimg);

						me.endLoading();
					}
				} // EO success
    	}); // EO jsonp request
      
    } // EO else
//    this.endLoading();

  },


  /**
   * Handy method to remove all dom domeElement's children elements
   * @param {Ext.Element} domElement a dom element
   */
  clearDomBelow: function(domElement) {
		if (domElement.hasChildNodes()) {
			while (domElement.childNodes.length > 0) {
				domElement.removeChild(domElement.firstChild);
			}
		}
	},


  /**
   * Display the keywords for the current target
   * @param {String} keywords a semi-colon separated list of keywords
   */
	addKeywords: function(keywords) {
		var bits;
		if (HT.lib.Util.isClassOf(keywords, 'String'))
			bits = keywords;
		else
			bits = keywords.join(', '); // it is an array
		
		var keywordDisplayField = this.down('#keywords');
		var bodyEl = keywordDisplayField.bodyEl;
		var domElem = bodyEl.dom;
		this.clearDomBelow(domElem);

		var output;
		if (this.privates.target_name_provenance) {
			var source = this.recordData.data['keywords_src'];
			var sourceItem = this.recordData.data['keywords_item']
			var cls = TDGUI.util.LDAConstants.LDA_SRC_CLS_MAPPINGS[source];
			cls += 'Icon';
			cls = this.privates.provIconsPath + cls + '.png';

			output = '{kw} <a href="' + sourceItem + '">' + '<img src="' + cls + '" title=' + source + ' height="15" width="15"/>' + '</a>';
		}
		else {
			output = '{kw}'
		}

		var tpl = Ext.DomHelper.createTemplate({
			tag: 'div',
			cls: 'keyword',
			html: output
			// html: '{kw}'
		});

		tpl.append(bodyEl, {
			kw: bits
		});

		keywordDisplayField.show();
	},


  /**
   * Set the organism field to the value for the current target
   * @param {String} organism the organism name
   */
	addOrganism: function(organism) {
		var organismDisplayField = this.down('#organism');
		var bodyEl = organismDisplayField.bodyEl;
		var domElem = bodyEl.dom;
		this.clearDomBelow(domElem);

		var output;
		if (this.privates.target_name_provenance) {
			var sourceItem = this.recordData.data['organism_item'];
			var source = this.recordData.data['organism_src'];
			var cls = TDGUI.util.LDAConstants.LDA_SRC_CLS_MAPPINGS[source];
			cls += 'Icon';
			cls = this.privates.provIconsPath + cls + '.png';

			output = '{org} <a href="' + sourceItem + '" target="_blank">' + '<img src="' + cls + '" title=' + source + ' height="15" width="15"/>' + '</a>';
		}
		else {
			output = '{org}'
		}

		var tpl = Ext.DomHelper.createTemplate({
			tag: 'div',
			cls: 'organism',
			html: output
		});

		tpl.append(bodyEl, {
			org: organism
		});
		organismDisplayField.show();
	},


  /**
   * Add synonim terms for the current target (see #addKeywords)
   * @param {Array} synonyms
   */
	addSynonyms: function(synonyms) {
		var bits;
		if (Object.prototype.toString.call(synonyms).match(/\s([a-zA-Z]+)/) == 'String')
			bits = synonyms.split('; ');
		else
			bits = synonyms;

		var synonymsField = this.down('#synonyms');
		var bodyEl = synonymsField.bodyEl;
		var domElem = bodyEl.dom;
		this.clearDomBelow(domElem);

		var output;
		if (this.privates.target_name_provenance) {
			var source = this.recordData.data['synonyms_src'];
			var sourceItem = this.recordData.data['synonyms_item'];
			var cls = TDGUI.util.LDAConstants.LDA_SRC_CLS_MAPPINGS[source];
			cls += 'Icon';
			cls = this.privates.provIconsPath + cls + '.png';

			output = '{syn} <a href="' + sourceItem + '" target="_blank">' + '<img src="' + cls + '" title=' + source + ' height="15" width="15"/>' + '</a>';
		}
		else {
			output = '{syn}'
		}

		var tpl = Ext.DomHelper.createTemplate({
			tag: 'div',
			cls: 'synonym',
			html: output
		});
		var counter = 0;
		Ext.each(bits, function(synonym) {
			var mySyn = synonym;
      	if (counter < bits.length-1)	mySyn += ', ';

			tpl.append(bodyEl, {
				syn: mySyn
			});
			counter ++;
		}, this);

		synonymsField.show();
	},


  /**
   * Set the pdb image based on the pdb id.
   * @param {String} pdbIdPage a pdb url for the image
   */
	addPDBImage: function(pdbIdPage) {
		// example http://www.pdb.org/pdb/explore/explore.do?structureId=1HOF
		//         http://www.rcsb.org/pdb/images/1HOF_asr_r_250.jpg
		// for Uniprot retrieved info: <img src=\"http://www.rcsb.org/pdb/images/2Y6E_asr_r_80.jpg\" width=\"80\" height=\"80\" />
    if (pdbIdPage === undefined || pdbIdPage.length == 0)
      return;

    var bits = new String(pdbIdPage);
    var finalPDBValue = new String();
    var pdbID, firstPDB;
    bits = bits.split(",");

    Ext.each(bits, function(item, index) {
      //console.log(" item " + item);
      pdbID = item.split('/').pop();
      if (index == 0) {
        firstPDB = pdbID;
      }
      finalPDBValue += '<a target=\'_blank\' href=\'' + item + '\'>' + pdbID + '</a>   '

    }, this);
    var pdbField = this.down('#pdb_id_page');
    // console.log("TargetInfo pdb vale: " +finalPDBValue);
    pdbField.setRawValue(finalPDBValue);
    pdbField.show();

		var stringURL = new String(pdbIdPage);
		var img = this.down('#target_image');
		var pdbID;
		if (stringURL.indexOf('<img') == 0) {
			var initPdbId = stringURL.indexOf('s/');
			var endPdbId = stringURL.indexOf('_asr', initPdbId);
			pdbID = stringURL.substring(initPdbId+2, endPdbId);

			pdbIdPage = 'http://www.pdb.org/pdb/explore.do?structureId='+pdbID;			
		}
		else {
			var pdbID = stringURL.substr(stringURL.lastIndexOf('=') + 1);
	    if (pdbID == pdbIdPage)
	      pdbID = stringURL.substr(stringURL.lastIndexOf('/') + 1);
	  }
	  img.setSrc('http://www.rcsb.org/pdb/images/' + pdbID + '_asr_r_250.jpg');
		img.show();
/*
		var pdbField = this.down('#pdb_id_page');
		pdbField.setRawValue('<a target=\'_blank\' href=\'' + pdbIdPage + '\'>' + pdbID + '</a>');
		pdbField.show();
*/
		
	},


  /**
   * Set information fields for the current target
   * @param {String} fieldId the field identifier
   * @param {String} value the value for that field
   */
	setFieldValue: function(fieldId, value) {
		if (fieldId == 'synonyms') {
			//            console.log('synonyms');
      if (value != null && value.length > 0)
			  this.addSynonyms(value);
		}
    else if (fieldId == 'keywords') {
			//            console.log('keywords');
      if (value != null && value.length > 0)
			  this.addKeywords(value);
		}
    else if (fieldId == 'organism') {
			//            console.log('organism');
			if (value != null && value.length > 0)
        this.addOrganism(value);
		}
    else if (fieldId == 'pdb_id_page') {
			if (value != null && value.length > 0)
        this.addPDBImage(value);
		}
    else {
// console.log('standard field: '+fieldId+' -> '+value);
			var field = this.down('#' + fieldId);
			var noShowField = value == null || value === undefined || value.length == 0;
			// if (field != null) {
			if (!noShowField && field != null) {
        field.setValue(value);
        field.show();
        field.setVisible(true);
      }

		}
	},


/**
 * Set the target info data on the panel info and, in addition, sets the handler
 * for the pharma button (BAD: it should be on the controller)
 * @param target, the very first record retrieved with target info data
 */
	setValues: function(target) {
		this.resetAllFields();
		var td = target.data;
		this.recordData = target;

// Set the provenance checkbox id and itemId to avoid id collisions
		var chkBox = this.down('checkbox');


// Pharmacology data button initialization
    var pharmButton = this.down('#pharmTargetButton');
    var protein_uri = target.store.proxy.extraParams.protein_uri;

// get the concept_uri for pharma_button. it will be such as
// conceptwiki.org/concept/<concept_uuid>

//    if (protein_uri.indexOf("uniprot") == -1) {
    if (this.concept_uuid != undefined && this.concept_uuid.length > 0) {
      var targetName = target.get('target_name') || target.get('prefLabel');
      var pharmaURI = 'http://www.conceptwiki.org/concept/'+this.concept_uuid;

      pharmButton.hide();
      pharmButton.setHandler(function () {
  // console.info('pharmButton.setHandler -> !xt=tdgui-pharmbytargetpanel&qp=' + target.store.proxy.extraParams.protein_uri)
        var historyParams = '!xt=tdgui-pharmbytargetpanel&qp=' +pharmaURI;
        historyParams += '&tg=' + targetName;
        historyParams += '&dc=' + Math.random();

        Ext.History.add(historyParams);
      });
    }
    else
      pharmButton.disable();

    pharmButton.show();

    for (var prop in td) {
			if (td.hasOwnProperty(prop)) {
				//                console.log(prop);
				this.setFieldValue(prop, td[prop]);
			}
		}

		this.doLayout();
	},




	startLoading: function() {
console.info ('TargetInfo.startLoading')
		this.setLoading({msg: 'Loading data...'}, true);
	},


  endLoading: function() {
console.info ('TargetInfo.endLoading')
		this.setLoading(false);
	},



	toggleProvenance: function (thisComp, newVal) {
		console.log('toggleProvenance newVal: '+newVal);
		thisComp.privates.target_name_provenance = newVal;
	},



	privates: {
		target_name_provenance: false,
		provIconsPath: '/images/provenance/',

		provenanceTargetSummaryRenderer: function (value, field) {
			// console.log("Target by name provenance renderer for field: "+field.itemId+"("+value+")");
			var me = this.up('tdgui-targetinfopanel'); // this is the field!!

			var sources = new Array();
			sources['http://www.chemspider.com'] = "ChemSpider";
			sources['http://data.kasabi.com/dataset/chembl-rdf'] = "Chembl";
			sources['http://linkedlifedata.com/resource/drugbank'] = "DrugBank";
			sources['http://www.conceptwiki.org'] = "ConceptWiki";
			sources['http://purl.uniprot.org'] = "UniProt";

			if (me.privates.target_name_provenance) {
				console.log("Yielding provenance!!");
				var recdata = field.itemId;
				var itemdata = recdata + '_item';
				recdata += '_src';

				var source = me.recordData.data[recdata];
				var cls = TDGUI.util.LDAConstants.LDA_SRC_CLS_MAPPINGS[source];
				if (!cls) {
					cls = 'defaultValue';
				}
				var iconCls = cls + 'Icon';
				// iconCls = '/assets/' + iconCls + '.png';
				iconCls = me.privates.provIconsPath + iconCls + '.png';

				// cls += LDAProvenanceMode;
				// cls += 'Summary';

				var output = '';
				// output =  '<div class="' + cls + '">' + value  + '   <a href="' + source + '">' + '<img class="' + iconCls + '" height="15" width="15"/>' + '</a>'+ '</div>';
				output = '<div>' + value + '   <a href="' +
					me.recordData.data[itemdata] + '" target="_blank">' +
					'<img src="' + iconCls + '" title="' + sources[source] + '" height="15" width="15"/>' +
					'</a>' + '</div>';

				return output;
			}
			else {
				return value;
			} // EO if

		} // EO provenanceTarget...
	} // EO private(s) member(s)


});
