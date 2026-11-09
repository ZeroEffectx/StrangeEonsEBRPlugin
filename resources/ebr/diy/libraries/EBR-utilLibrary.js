/*
	Utility library for the Earthborne Rangers plugin
	Contains various utility methods
*/

const PortraitList = [];

const FACE_FRONT = 0;
const FACE_BACK = 1;

function getAspectAbbreviation( aspect ) {
	switch ( aspect ) {
		case 'Awareness':
			return 'AWA';
		case 'Spirit':
			return 'SPI';
		case 'Fitness':
			return 'FIT';
		case 'Focus':
			return 'FOC';
		default:
			return '';
	}
}

function getAspectTintForFrame(aspect) {
	switch(aspect) {
		case 'Awareness':
			return [1.0, 0.9, 0.9];
		case 'Spirit':
			return [0.72, 1.2, 1.55];
		case 'Fitness':
			return [0.6, 1.5, 1.1];
		case 'Focus':
			return [0.25, 1.2, 0.9];
		default:
			return [1.0, 1.0, 1.0];
	}
}

function initCopyrightTags( diy, textBox ) {
	textBox.setReplacementForTag($Copyright-tag, $Copyright-tag-replacement);
}

function initBodyTags( diy, textBox ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	for( let index = 0; index < EBRObject.TagList.length; index++ ){
		let item = EBRObject.TagList[index];
		textBox.setReplacementForTag($(item+'-tag'), $(item+'-tag-replacement'));
	}
	
	initBodyStyleTags( diy, textBox );
}

function initBodyStyleTags( diy, textBox ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	for( let index = 0; index < EBRObject.StyleList.length; index++ ) {
		let item = EBRObject.StyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}
}

function initRangerCardBodyTags( diy, textBox) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	for( let index = 0; index < EBRObject.RangerCardTagList.length; index++ ){
		let item = EBRObject.RangerCardTagList[index];
		textBox.setReplacementForTag($(item+'-tag'), $(item+'-tag-replacement'));
	}
	
	for( let index = 0; index < EBRObject.RangerCardStyleList.length; index++ ) {
		let item = EBRObject.RangerCardStyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}
}

function initMissionCardBodyTags( diy, textBox) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	for( let index = 0; index < EBRObject.MissionCardTagList.length; index++ ){
		let item = EBRObject.MissionCardTagList[index];
		textBox.setReplacementForTag($(item+'-tag'), $(item+'-tag-replacement'));
	}
	
	for( let index = 0; index < EBRObject.MissionCardStyleList.length; index++ ) {
		let item = EBRObject.MissionCardStyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}
}

function initSpecialBodyTags(diy, textBox, cardType) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	var tags = EBRObject.SpecialtyTagDictionary[cardType];
	if(tags) {
		for( let index = 0 ; index < tags.length ; index++ ){
			let item = tags[index];
			textBox.setReplacementForTag($(item+'-tag'), $(item+'-tag-replacement'));
		}
	}
	
	var styles = EBRObject.SpecialtyStyleDictionary[cardType];
	if(styles) {
		for( let index = 0; index < styles.length; index++ ) {
			let item = styles[index];
			textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
		}
	}
}

function initMissionCardChallengeBodyTags( diy, textBox) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	for( let index = 0; index < EBRObject.MissionCardChallengeStyleList.length; index++ ) {
		let item = EBRObject.MissionCardChallengeStyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}	
}

function updatePathSet() {
	var settings = Settings.getUser();
	
	if ( $PathSet == 'CustomSet' ) {
		// $PathSetType = '-1';
		return;
	}
	
	var EBRObject = Eons.namedObjects.EBRObject;
	
	for ( let index = 0; index < EBRObject.basicPathSetList.length; index++ ) {
		if ( $Collection == EBRObject.basicPathSetList[ index ] ) {
			// $CollectionType = '0';
			return;
		}
	}
}

function updateUsedPathSets( o ) {
	o.comboPathSet = [];
	
	for ( let index = 0; index < o.basicPathSetList.length; index++ ) {
		let entry = o.basicPathSetList[index];
		
		o.comboPathSet[o.comboPathSet.length] = ListItem(
			entry[0], entry[1],
			ImageUtils.createIcon(ImageUtils.get('ebr/icons/path-sets/' + entry[0] + '.png'), 12, 12)
		);
	}
	
	for( let index = 0; index < o.corePathSetList.length; index++ ) {
		let entry = o.corePathSetList[index];
		
		o.comboPathSet[o.comboPathSet.length] = ListItem(
			entry[0], entry[1],
			ImageUtils.createIcon(ImageUtils.get('ebr/icons/path-sets/' + entry[0] + '.png'), 12, 12)
		);
	}
	
	for (let index = 0; index < o.arcologyPathSetList.length; index++) {
		let entry = o.arcologyPathSetList[index];
		
		o.comboPathSet[o.comboPathSet.length] = ListItem(
			entry[0], entry[1],
			ImageUtils.createIcon(ImageUtils.get('ebr/icons/path-sets/' + entry[0] + '.png'), 12, 12)
		);
	}
}

function updateLocationSetList(o) {
	o.comboLocationSet = [];
	
	for( let index = 0 ; index < o.allLocationsSetList.length ; index++ ) {
		let entry = o.allLocationsSetList[index];
		
		o.comboLocationSet[o.comboLocationSet.length] = ListItem(
			entry[0], entry[1], ImageUtils.createIcon(ImageUtils.get('ebr/icons/path-sets/' + entry[0] + '.png'), 12, 12)
		);
	}
}

function countChallengeEffects(challengeEffects) {
	let challengeEffectsWithText = 0;
	for( let index = 0; index < challengeEffects.length; index++) {
		if(challengeEffects[index] != '') {
			challengeEffectsWithText++;
		}
	}
	return challengeEffectsWithText;
}

function createPortraits( diy, portraitKeys ) {
	diy.customPortraitHandling = true;
	diy.bleedMargin = 0;

	for( let index = 0; index < portraitKeys.length; index++ ) {
		let fullKey = portraitKeys[index];
		
		createPortrait( diy, fullKey, index );
	}
}

function createPortrait( diy, fullKey, index ) {
	var partArray = fullKey.split('-');

	var key = partArray[0];
	var faces = partArray[1];
	
	var settingsFace;
	var fillBackground;
	var allowRotation;
	// var scaleUsesMinimum = false;
	
	var facesArray;

	switch ( faces ) {
		case 'Back':
			facesArray = [0, 1];	// making this [0, 1] seems to get rid of the masking in the portrait panel
			settingsFace = FACE_BACK;
			break;
		case 'Both':
			facesArray = [0, 1];
			settingsFace = FACE_FRONT;
			break;
		default:
			facesArray = [0];
			settingsFace = FACE_FRONT;
			break;
	}
	
	switch( key ) {
		case 'Portrait':
		case 'BackPortrait':
			fillBackground = true;
			allowRotation = true;
			break;
		case 'TransparentPortrait':
			fillBackground = false;
			allowRotation = false;
			break;
		default:
			fillBackground = false;
			allowRotation = true;
			break;
	}
	
	setPortraitDefaults( diy, settingsFace, key );
	
	PortraitList[index] = new DefaultPortrait( diy, CardType + '-' + key, allowRotation );
	PortraitList[index].facesToUpdate = facesArray;
	PortraitList[index].backgroundFilled = fillBackground;
	let test = diy.settings.get(CardType+'-'+key+'-portrait-scale-minimum');
	if(diy.settings.get(CardType+'-'+key+'-portrait-scale-minimum') == 'true') {
		PortraitList[index].setScaleUsesMinimum( true );
	}
	PortraitList[index].installDefault();
}

function setPortraitDefaults( diy, faceIndex, key ) {
	if ( diy.settings.get( CardType + '-' + key + '-portrait-template', '' ) == '') {
		diy.settings.set( CardType + '-' + key + '-portrait-template', 'ebr/images/empty1x1.png' );
	}
	
	if ( diy.settings.get( CardType + '-' + key + '-portrait-rotation', '' ) == '' ) {
		diy.settings.set( CardType + '-' + key + '-portrait-rotation', '0' );		
	}
	
	//if ( diy.settings.get( CardType + '-' + key + '-portrait-clip-region', '' ) == '' ) {
	//	diy.settings.set( CardType + '-' + key + '-portrait-clip-region', $( CardType + '-' + key + '-portrait-clip-region' ) );		
	//}
}

function readPortraits( diy, oos, typeList ) {
	for ( let index = 0; index < typeList.length; index++ ) {
		PortraitList[index] = oos.readObject();
	}
}

function writePortraits( oos, typeList ) {
	for ( let index = 0; index < typeList.length; index++) {
		let portrait = getPortrait( index );
		
		oos.writeObject( portrait );
	}
}

function getPortraitCount() {
	return PortraitList.length;
}

function getPortrait( index ) {
	if( index < 0 || index >= PortraitList.length ) {
		throw new Error( 'Invalid portrait index: ' + index );
	}
	return PortraitList[ index ];
}