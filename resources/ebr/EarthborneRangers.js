/*
 * EarthborneRangers.js
 */
importClass( arkham.diy.ListItem );

useLibrary( 'extension' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );


/**
 * Called when the plug-in is loaded. This is the entry point for
 * extension plug-ins; whatever you want the plug-in to do should
 * be included here.
 */
function initialize() {
	try {
		var InterfaceLanguage = Language.getInterface();
		InterfaceLanguage.addStrings('ebr/text/EBR-Interface');
		
		const ebrGame = Game.register('EBR', 'EBR-Name', image('EarthborneRangers', 'png'));
	
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/EBR-Game.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Ranger-Card.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Role-Card.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Mission-Card.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/CampaignGuide-Page.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Path-Card.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Weather-Card.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Location-Card.settings');
		ebrGame.masterSettings.addSettingsFrom('ebr/settings/Path-Moment-Card.settings');
	
		Eons.namedObjects.EBRObject = new gameObject( ebrGame.masterSettings );
	
		ClassMap.add( 'ebr/EarthborneRangers.classmap' );
	} catch (ex) {
		Eons.log.severe('Earthborne Rangers plug-in failed to start');
        Error.handleUncaught(ex);
        return false;
    }
    return true;
}

function gameObject( masterSettings ) {
	
	const registerTTFont = function registerTTFont() {
		for( let i=0; i<arguments.length; ++i ) {
			arguments[i] = 'ebr/fonts/' + arguments[i] + '.ttf';
		}
		return FontUtils.registerFontFamilyFromResources.apply( this, arguments );
	};
	const registerOTFont = function registerOTFont() {
		for( let i=0; i<arguments.length; ++i ) {
			arguments[i] = 'ebr/fonts/' + arguments[i] + '.otf';
		}
		return FontUtils.registerFontFamilyFromResources.apply( this, arguments );
	};
	
	this.titleFamily = registerOTFont('HypatiaSansPro-Regular', 'HypatiaSansPro-Bold');
	this.titleFontSize = 21.0;
	
	this.missionTitleFontSize = 23.0;
	
	this.standardTextFamily = registerTTFont('Avenir-Medium');
	
	this.rangerCardTypeFamily = registerTTFont('AvenirNextCondensed-Medium', 'AvenirNextCondensed-MediumItalic');
	this.rangerCardTypeFontSize = 13.0;
	this.rangerCardTypeFontSpacing = 1.0;
	
	this.missionCardTypeFontSize = 14.0;
	this.missionCardObjectiveFontSize = 15.2;
	
	// TO DO: Rename to more generic since the set info uses it as well
	this.rangerCardTokenNameFamily = registerTTFont('AvenirNextCondensed-DemiBold');
	this.rangerCardTokenNameFontSize = 9.6;
	this.rangerCardTokenNameFontSpacing = 1.0;
	this.pathCardTokenNameFontSize = 10.0;
	
	this.rangerCardSetInfoFontSize = 11.2;
	this.rangerCardSetInfoTracking = 0.03;
	this.rangerCardSetInfoWidth = 1.0;
	
	this.rangerCardStatReqFamily = this.rangerCardTokenNameFamily;
	this.rangerCardStatReqFontSize = 13.0;
	this.rangerCardStatReqFontSpacing = 1.0;
	
	this.rangerCardFooterFamily = this.titleFamily;
	this.rangerCardFooterFontSize = 9.4;
	this.rangerCardFooterFontSpacing = 1.0;
	
	this.bodyFamily = registerTTFont('Avenir-Book');
	this.bodyFontTightness = 0.68;
	this.bodyFontSize = 14.2;
	this.bodyFontWidth = 1.2;
	this.bodyFontSpacing = 1.06;
	this.bodyFontWideSpacing = 1.09;
	
	this.boldBodyFamily = registerTTFont('Avenir-Black');
	this.boldBodyFontSize = 14.5;
	this.boldBodyFontSpacing = 1.09;
	this.boldBodyFontTracking = -0.02;
	
	this.challengeFamily = registerTTFont('Avenir-Heavy');
	this.challengeFontSize = 14.6;
	this.challengeFontSpacing = 1.0;
	
	this.flavorFamily = registerTTFont('Avenir-Light');
	this.flavorFontSize = 14.6;
	this.flavorFontSpacing = 1.0;
	
	this.symbolFamily = registerTTFont( 'EBR-Icons-Regular');
	this.symbolSize = 15.0;
	
	this.guideBodyFontSize = 8.0;
	this.guideHeaderFamily = registerTTFont('Avenir-Medium');
	this.guideHeaderFontSize = 14.0;
	
	//Key-Value pairs, second can be localized
	this.aspects = new Array(
		ListItem('Awareness', 'Awareness'),
		ListItem('Spirit', 'Spirit'),
		ListItem('Fitness', 'Fitness'),
		ListItem('Focus', 'Focus'));
	
	this.TagList = new Array (
		'Fitness', 'Focus', 'Awareness', 'Spirit',
		'Connection', 'Conflict', 'Exploration', 'Reason',
		'Progress', 'Harm', 'Presence',
		'Crest', 'Sun', 'Mountain', 'Shuffle',
		'RangerToken', 'PerRanger', 'IfThen', 'Journal',
		'Exhaust', 'Response', 'Plus', 'BulletPoint',
		'HorizontalSpacer', 'SmallVerticalSpacer', 'VerticalSpacer', 'LargeVerticalSpacer', 'ExtraLargeVerticalSpacer', 'HugeVerticalSpacer'
	);
	
	this.RangerCardTagList = new Array (
		'RangerCard-HorizontalBar'
	);
	
	this.MissionCardTagList = new Array (
		'MissionCard-HorizontalBar', 'MissionCard-LongHorizontalBar'
	);
	
	this.StyleList = new Array (
		'BoldBody', 'EBRSymbol'
	);
	
	this.RangerCardStyleList = new Array (
		'RangerCard-FlavorText'
	);
	
	this.MissionCardStyleList = new Array (
		'MissionCard-FlavorText'
	);
	
	this.MissionCardChallengeStyleList = new Array (
		'MissionCard-ChallengeFlavorText'
	);
	
	this.SpecialtyTagDictionary = {
		"Location": [ 'LocationCard-HorizontalBar', 'LocationCard-LongHorizontalBar' ],
		"Path": [ 'Path-Card-HorizontalBar' ],
		"PathMoment": [ 'PathMomentCard-HorizontalBar', 'PathMomentCard-LongHorizonalBar', 'PathMomentCard-YouChooseBox', 'PathMomentCard-RangersChooseBox' ],
		"Weather": [ 'Weather-Card-HorizontalBar' ],
		"ChallengeEffect": [  ]
	};
	
	this.SpecialtyStyleDictionary = {
		"Location": [ 'LocationCard-HeaderText' ],
		"PathMoment": [ 'PathMomentCard-FlavorText', 'PathMomentCard-ChallengeFlavorText', 'PathMomentCard-ChoiceText' ],
		"Weather": [ 'Weather-Card-FlavorText', 'Weather-Card-ChallengeFlavorText' ],
		"ChallengeEffect": [ 'ChallengeEffect-FlavorText' ]
	};
	
	// TO DO: Rename to something more generic
	this.comboCost = new Array(
		ListItem( '-', '-' ),
		ListItem( 'X', 'X' ),
		ListItem( '<i>/</i>', '/' ));
	for( let index = 0; index <= 99; index++ ) {
		this.comboCost[this.comboCost.length] = ListItem( index, String(index) );
	}
	
	// TO DO: Add the asterisk version
	this.comboApproach = new Array(
		ListItem('None', 'None'),
		ListItem('Connection', 'Connection'),
		ListItem('Conflict', 'Conflict'),
		ListItem('Exploration', 'Exploration'),
		ListItem('Reason', 'Reason'));
		
	this.maxEquipValue = 5;
	this.comboEquipValue = new Array();
	for( let index = 0; index <= this.maxEquipValue; index++ ) {
		this.comboEquipValue[this.comboEquipValue.length] = ListItem( index, String(index) );
	}
	
	this.comboTokens = new Array(
		ListItem( '-', '-' ),
		ListItem( 'X', 'X' ) );
	for( let index = 0; index <= 9; index++ ) {
		this.comboTokens[this.comboTokens.length] = ListItem( index, String(index) );
	}
	
	this.comboProgress = new Array(
		ListItem( '-', '-' ),
		ListItem( 'Ranger', 'Ranger' ),
		ListItem( 'X', 'X' ),
		ListItem( '<i>/</i>', '/' ) );
	for( let index = 0; index <= 99; index++ ) {
		this.comboProgress[this.comboProgress.length] = ListItem( index, String(index) );
	}
	
	this.comboMissionFrame = new Array(
		ListItem('ValleyRegular', 'Valley Regular'),
		ListItem('ValleyTall', 'Valley Tall'),
		ListItem('ArcologyRegular', 'Arcology Regular'),
		ListItem('ArcologyTall', 'Arcology Tall'),
		ListItem('Custom', 'Custom'));
		
	this.comboMissionObjectiveType = new Array(
		ListItem('-', '-'),
		ListItem('NonPivotalLocation', 'Non Pivotal Location'),
		ListItem('PivotalLocation', 'Pivotal Location'),
		ListItem('Checkbox', 'Checkbox'));
		
	this.comboPathCardArea = new Array(
		ListItem('Up', 'Along the Way'),
		ListItem('Down', 'Within Reach'),
		ListItem('Double-Up', 'Surroundings'));
		
	this.comboPageNumbers = new Array(
		ListItem( '-', '-' ) );
	for( let index = 0; index <= 99; index++ ) {
		this.comboPageNumbers[this.comboPageNumbers.length] = ListItem( index, String(index) );
	}
	
	this.basicPathSetList = new Array(
		[ 'CustomSet', 'Custom Path Set' ],
		[ 'Generic', 'Blank' ],
		[ 'General', 'General' ]
	);
	
	this.coreBiomePathSets = new Array(
		[ 'Woods', 'Woods' ],
		[ 'Lakeshore', 'Lakeshore' ],
		[ 'Grassland', 'Grassland' ],
		[ 'Mountain', 'Mountain' ],
		[ 'OldGrowth', 'Old Growth' ],
		[ 'Ravine', 'Ravine' ],
		[ 'River', 'River' ],
		[ 'Swamp', 'Swamp' ],
		[ 'Valley', 'Valley' ]
	);
	
	this.arcologyBiomePathSets = new Array(
		[ 'AncientRuins', 'Ancient Ruins' ],
		[ 'CaveSystem', 'Cave System' ],
		[ 'DeepRoots', 'Deep Roots' ],
		[ 'FloodedRuins', 'Flooded Ruins' ],
		[ 'FungalForest', 'Fungal Forest' ]
	);
	
	this.locationSetList = new Array(
		[ 'Branch', 'Branch' ],
		[ 'FracturedWall', 'Fractured Wall' ],
		[ 'LoneTree', 'Lone Tree Station' ],
		[ 'MarshOfRebirth', 'Marsh of Rebirth' ],
		[ 'Meadow', 'Meadow' ],
		[ 'NorthernOutpost', 'Northern Outpost' ],
		[ 'Spire', 'Spire' ],
		[ 'Tumbledown', 'Tumbledown' ],
		[ 'WhiteSky', 'White Sky' ],
		[ 'CustomLocation', 'Custom Location' ]
	);
	
	this.arcologyLocationSetList = new Array (
		[ 'ArboretumOfMemory', 'Arboretum of Memory' ],
		[ 'Artery', 'Artery' ],
		[ 'MycelialConclave', 'Mycelial Conclave' ],
		[ 'TheCage', 'The Cage' ],
		[ 'TheChimney', 'The Chimney' ],
		[ 'VerdantSphere', 'Verdant Sphere' ]
	);
	
	this.corePathSetList = this.coreBiomePathSets.concat(this.locationSetList);
	this.arcologyPathSetList = this.arcologyBiomePathSets.concat(this.arcologyLocationSetList);
	this.allLocationsSetList = this.locationSetList.concat(this.arcologyLocationSetList);
	
	updateUsedPathSets(this);
	updateLocationSetList(this);
}


/**
 * Returns a short name for the plug-in.
 */
function getName() {
	return 'Earthborne Rangers';
}


/**
 * Returns a brief description of the plug-in.
 */
function getDescription() {
	return 'Plugin for creating cards for Earthborne Rangers';
}


/**
 * Returns a version number for the plug-in.
 */
function getVersion() {
	return 1.0;
}


/**
 * This function is called when the plug-in is being unloaded.
 * (Extension plug-ins are unloaded during application shutdown.)
 *
 * If this function is empty, you can safely delete it from your script.
 */
function unload() {
}

// This function is a convenient shortcut for getting this plug-in's images
function image(resource, ext) {
    if (ext == undefined) {
        ext = 'jp2';
    }
    return ImageUtils.get('ebr/' + resource + '.' + ext);
}

// This is part of the diy library; calling it from within a
// script that defines the needed functions for a DIY component
// will create the DIY from the script and add it as a new editor;
// however, saving and loading the new component won't work correctly.
// This means you can test your script directly by running it without
// having to create a plug-in (except to make any required resources
// available).
if( sourcefile == 'Quickscript' ) {
	useLibrary('project:EarthborneRangers/resources/ebr/diy/libraries/EBR-utilLibrary.js');
	useLibrary('project:EarthborneRangers/resources/ebr/diy/libraries/EBR-layoutLibrary.js');
	useLibrary('project:EarthborneRangers/resources/ebr/diy/libraries/EBR-drawLibrary.js');
	
	testDIYScript();
}
else {
	useLibrary('res://ebr/diy/libraries/EBR-utilLibrary.js');
	useLibrary('res://ebr/diy/libraries/EBR-layoutLibrary.js');
	useLibrary('res://ebr/diy/libraries/EBR-drawLibrary.js');
}