importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary('diy');
useLibrary('ui');
useLibrary('markup');
useLibrary('imageutils');

importClass(arkham.component.DefaultPortrait);

const CardType = 'Weather-Card';
const FacePrefixes = [ 'Front', 'Back' ]; //Used to generate/bind the identical set of UI controls to both the front and back
const PortraitTypeList = [ 'TransparentPortrait-Front', 'TransparentPortrait-Back' ];

function create(diy) {
    diy.faceStyle = FaceStyle.TWO_FACES;
	diy.frontTemplateKey = "Weather-Card-Default";
	diy.backTemplateKey = "Weather-Card-Default";
	
	diy.name = '';
	setDefaults();
		
	createPortraits( diy, PortraitTypeList );
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 1.2;
}

function createInterface(diy, editor) {
	var EBRObject = Eons.namedObjects.EBRObject;

    var bindings = new Bindings(editor, diy);
    
	var frontStack = new Stack();
	var backStack = new Stack();
	
	for(i = 0; i < FacePrefixes.length ; i++) {
		let cardSettingsPane = new TabPane();
		let panel = new Grid("fillx");
		
		// Front Headings Panel
		let headingsSubPanel = new Grid("fillx");
		headingsSubPanel.setTitle("Headings");
		
		// The front of the weather is specifically bound to the name, so the first UI control for each
		// side is slightly different
		if(i == 0) {
			let nameField = textField();
			diy.setNameField(nameField);
			let nameLabel = label("&Name", nameField);
			headingsSubPanel.place(nameLabel, "split", nameField, "spanx 2, growx, wrap");
		}
		else {
			let backTitleField = textField();
			bindings.add("BackTitle", backTitleField, [0]);
			headingsSubPanel.place("Title", "split", backTitleField, "spanx 2, growx, wrap");
		}
		
		let cardTypeField = textField('', 20);
		bindings.add(FacePrefixes[i]+"Type", cardTypeField, [0]);
		headingsSubPanel.place("Card Type", 'split', cardTypeField, '');
		
		let traitsField = textField('', 25);
		bindings.add(FacePrefixes[i]+"Traits", traitsField, [0]);
		headingsSubPanel.place("Traits", 'split', traitsField, 'spanx 2, wrap');
		
		panel.place(headingsSubPanel, 'wrap');
		
		// Front Tokens Panel
		let tokensSubPanel = new Grid("fillx");
		tokensSubPanel.setTitle("Tokens");
		
		var tokenValueList = new comboBox( EBRObject.comboTokens, null );
		bindings.add(FacePrefixes[i]+"TokenValue", tokenValueList, [0]);
		var tokensPerRangerButton = new toggleButton( '', ImageUtils.createIcon(ImageUtils.get('ebr/icons/PerRanger.png'), 12, 12), false );
		bindings.add(FacePrefixes[i]+"AreTokensPerRanger", tokensPerRangerButton, [0] );
		var tokenOffset = new textField('', 8);
		bindings.add(FacePrefixes[i]+'TokensOffset', tokenOffset, [0] );
		tokensSubPanel.place(
			"Token Value", 'split', tokenValueList, 'width 50px', 
			tokensPerRangerButton, 'wmax 35, hmin 25, hmax 25',
			"Offset", 'split', tokenOffset, 'wrap'
		);
		
		var tokenNameField = textField('', 30);
		bindings.add(FacePrefixes[i]+"TokenName", tokenNameField, [0]);
		tokensSubPanel.place("Token Name", 'split, gapx 10', tokenNameField, 'spanx 2, wrap');
		
		panel.place(tokensSubPanel, 'wrap');
		
		// Footer Panel
		let footerSubPanel = new Grid("fillx");
		footerSubPanel.setTitle("Footer");
		
		let setInfoField = textField();
		bindings.add(FacePrefixes[i]+"SetInfo", setInfoField, [0]);
		footerSubPanel.place("Set Info", "split", setInfoField, "spanx 2, wrap, growx");
		
		let artistField = textField('', 25);
		bindings.add(FacePrefixes[i]+"Artist", artistField, [0]);
		footerSubPanel.place("Artist", "split", artistField, "growx");
		
		let copyrightField = textField('', 15);
		bindings.add(FacePrefixes[i]+"Copyright", copyrightField, [0]);
		footerSubPanel.place(
			"Copyright", "split", copyrightField, "spany 2",
			new tipButton( @( 'EBR-CopyrightTip' ) ), 'aligny top, gaptop 5'
		);
		
		panel.place(footerSubPanel, 'wrap');
		
		cardSettingsPane.place(panel, "Content");
		
		///////////////////////////
		///// Card Text panel /////
		///////////////////////////
		panel = new Grid("fillx");
		
		let textSubPanel = new Grid("fillx");
		textSubPanel.setTitle('Rules Text');
		
		let offsetCounter = spinner( 0, 100 );
		bindings.add(FacePrefixes[i]+"HeightOffset", offsetCounter, [0]);
		textSubPanel.place( "Offset (0-100)", "wmax 100", offsetCounter, "wrap, pushx, align left");
		
		let cardTextField = textArea("", 15, 50, true);
		bindings.add(FacePrefixes[i]+"CardText", cardTextField, [0]);
		let cardTextLabel = label("&Card Text", cardTextField);
		textSubPanel.place(
			cardTextLabel, 'wrap, spanx 3',
			cardTextField, "growx, spanx 2, spany 2",
			new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
			new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
		);
		
		panel.place(textSubPanel, 'wrap');
		
		let challengeSubPanel = new Grid("fillx");
		challengeSubPanel.setTitle('Challenge Effects');
		
		let sunEffectField = textArea("", 5, 50, true);
		bindings.add(FacePrefixes[i]+"SunEffect", sunEffectField, [0]);
		challengeSubPanel.place("Sun Effect", "wrap", sunEffectField, "spanx 3, growx, wrap");
		
		let mountainEffectField = textArea("", 5, 50, true);
		bindings.add(FacePrefixes[i]+"MountainEffect", mountainEffectField, [0]);
		challengeSubPanel.place("Mountain Effect", "wrap", mountainEffectField, "spanx 3, growx, wrap");
		
		let crestEffectField = textArea("", 5, 50, true);
		bindings.add(FacePrefixes[i]+"CrestEffect", crestEffectField, [0]);
		challengeSubPanel.place("Crest Effect", "wrap", crestEffectField, "spanx 3, growx, wrap");
		
		panel.place(challengeSubPanel, 'wrap');
		
		cardSettingsPane.place(panel, "Text & Effects");
		
		////////////////////////
		///// Portrait Tab /////
		////////////////////////
		panel = new Grid("fillx");
		let frontImagePanel = new portraitPanel( diy, i, "Portrait Adjustment" );
		panel.place( frontImagePanel, 'wrap, pushx, growx' );
		panel.setTitle("Portrait");
		
		cardSettingsPane.place(panel, "Portrait");
		
		// Add to the appropriate stack
		if(i == 0) {
			frontStack.add(cardSettingsPane);
		} 
		else {
			backStack.add(cardSettingsPane);
		}	
	}
	
	backStack.editorTabScrolling = true;
	backStack.addToEditor(editor, "Back", null, null, 0);
	frontStack.editorTabScrolling = true;
	frontStack.addToEditor(editor, "Front", null, null, 0);

    bindings.bind();
}

let titleTextBox, typeBox, tokenValueBox, tokenNameBox, textBox, 
	challengeTextBox, artistTextBox, setInfoTextBox, copyrightTextBox;

function createFrontPainter(diy, sheet) {
	titleTextBox = createTextBox(diy, sheet, 'Weather-Card-Title');
	typeBox = createTextBox(diy, sheet, 'Weather-Card-Type');
	
	tokenValueBox = createTextBox(diy, sheet, 'Weather-Card-Token-Value');
	tokenNameBox = createTextBox(diy, sheet, 'Weather-Card-Token-Name');
	initBodyTags(diy, tokenValueBox);
	
	textBox = createTextBox(diy, sheet, 'Weather-Card-Text');
	
	challengeTextBox = createTextBox(diy, sheet, 'Weather-Card-Challenge');
	
	artistTextBox = createTextBox(diy, sheet, 'Weather-Card-Artist');
	setInfoTextBox = createTextBox(diy, sheet, 'Weather-Card-Set-Info');
	copyrightTextBox = createTextBox(diy, sheet, 'Weather-Card-Copyright');
	
    initBodyTags(diy, challengeTextBox);
	initBodyTags(diy, textBox);
	initRangerCardBodyTags(diy, textBox);
	initSpecialBodyTags(diy, textBox, 'Weather-Card');
	initSpecialBodyTags(diy, challengeTextBox, 'Weather-Card');
	initCopyrightTags(diy, copyrightTextBox);
}

let backTitleTextBox, backTypeBox, backTokenValueBox, backTokenNameBox, backTextBox, 
	backChallengeTextBox, backArtistTextBox, backSetInfoTextBox, backCopyrightTextBox;

function createBackPainter(diy, sheet) {
    backTitleTextBox = createTextBox(diy, sheet, 'Weather-Card-Title');
	backTypeBox = createTextBox(diy, sheet, 'Weather-Card-Type');
	
	backTokenValueBox = createTextBox(diy, sheet, 'Weather-Card-Token-Value');
	backTokenNameBox = createTextBox(diy, sheet, 'Weather-Card-Token-Name');
	initBodyTags(diy, backTokenValueBox);
	
	backTextBox = createTextBox(diy, sheet, 'Weather-Card-Text');
	
	backChallengeTextBox = createTextBox(diy, sheet, 'Weather-Card-Challenge');
	
	backArtistTextBox = createTextBox(diy, sheet, 'Weather-Card-Artist');
	backSetInfoTextBox = createTextBox(diy, sheet, 'Weather-Card-Set-Info');
	backCopyrightTextBox = createTextBox(diy, sheet, 'Weather-Card-Copyright');
	
    initBodyTags(diy, backChallengeTextBox);
	initBodyTags(diy, backTextBox);
	initRangerCardBodyTags(diy, backTextBox);
	initSpecialBodyTags(diy, backTextBox, 'Weather');
	initSpecialBodyTags(diy, backChallengeTextBox, 'Weather');
	initCopyrightTags(diy, backCopyrightTextBox);
}


function paintFront(g, diy, sheet) {
    var EBRObject = Eons.namedObjects.EBRObject;
	
	var totalOffset = $FrontHeightOffset*5;
	
	// Paint Body Image
	let image = ImageUtils.get('ebr/templates/Weather-Card.png');
	w = image.getWidth();
	h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	PortraitList[0].paint( g, sheet.getRenderTarget() );
	
	g.setPaint(Color.BLACK);
	
	// Draw Title
	titleTextBox.markupText = diy.name;
	titleTextBox.draw(g, $$Weather-Card-Title-region.region);
	
	// Draw Type and Traits
	typeBox.markupText = $FrontType + ($FrontTraits != '' ? ' <i>/ ' + $FrontTraits + '</i>' : ''); // Adds traits after type (in italics with a starting '/')
	typeBox.draw(g, $$Weather-Card-Type-region.region);
	
	// Draw Token Box
	if ($FrontTokenValue != '-') {
		var tokenBoxRegion = $$Weather-Card-Token-Box-region.region;
		tokenBoxRegion.y += $FrontTokensOffset * 1;
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/weather/Weather-Token-Box.png'), tokenBoxRegion );
		
		var tokenValueRegion = $$Weather-Card-Token-Value-region.region;
		tokenValueRegion.y += $FrontTokensOffset * 1;
		tokenValueBox.markupText = $FrontAreTokensPerRanger != '0' ? $FrontTokenValue + '<per>' : $FrontTokenValue;
		tokenValueBox.draw(g, tokenValueRegion);
		
		var tokenNameRegion = $$Weather-Card-Token-Name-region.region;
		tokenNameRegion.y += $FrontTokensOffset * 1;
		tokenNameBox.markupText = $FrontTokenName;
		tokenNameBox.draw(g, tokenNameRegion);
	}
	
	// Draw Card Text
	textBox.markupText = $FrontCardText;
	textBox.setLineTightness(EBRObject.bodyFontTightness);
	
	var textBoxRegion = diy.settings.getRegion('Weather-Card-Text-region');
	textBoxRegion.y += totalOffset;
	textBoxRegion.height -= totalOffset;
	
	textBox.draw(g, textBoxRegion);
	
	// Draw challenge boxes
	//drawChallengeEffects(g, diy, sheet, 'Weather');
	drawChallengeEffects(g, diy, sheet, 'Weather', [ $FrontSunEffect, $FrontMountainEffect, $FrontCrestEffect ]);
	
	// Draw Artist credit
	artistTextBox.markupText = $FrontArtist;
	sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Artist-Icon.png'), $$Weather-Card-Artist-Icon-region.region );
	artistTextBox.draw(g, $$Weather-Card-Artist-region.region);
	
	// Draw Set info
	setInfoTextBox.markupText = $FrontSetInfo;
	setInfoTextBox.draw(g, $$Weather-Card-Set-Info-region.region);
	
	// Draw Copyright
	copyrightTextBox.markupText = $FrontCopyright;
	copyrightTextBox.draw(g, $$Weather-Card-Copyright-region.region);
}

function paintBack(g, diy, sheet) {
     var EBRObject = Eons.namedObjects.EBRObject;
	
	var totalOffset = $BackHeightOffset*5;
	
	// Paint Body Image
	let image = ImageUtils.get('ebr/templates/Weather-Card.png');
	w = image.getWidth();
	h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	PortraitList[1].paint( g, sheet.getRenderTarget() );
	
	g.setPaint(Color.BLACK);
	
	// Draw Title
	backTitleTextBox.markupText = $BackTitle;
	backTitleTextBox.draw(g, $$Weather-Card-Title-region.region);
	
	// Draw Type and Traits
	backTypeBox.markupText = $BackType + ($BackTraits != '' ? ' <i>/ ' + $BackTraits + '</i>' : ''); // Adds traits after type (in italics with a starting '/')
	backTypeBox.draw(g, $$Weather-Card-Type-region.region);
	
	// Draw Token Box
	if ($BackTokenValue != '-') {
		var tokenBoxRegion = $$Weather-Card-Token-Box-region.region;
		tokenBoxRegion.y += $BackTokensOffset * 1;
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/weather/Weather-Token-Box.png'), tokenBoxRegion );
		
		var tokenValueRegion = $$Weather-Card-Token-Value-region.region;
		tokenValueRegion.y += $BackTokensOffset * 1;
		backTokenValueBox.markupText = $BackAreTokensPerRanger != '0' ? $BackTokenValue + '<per>' : $BackTokenValue;
		backTokenValueBox.draw(g, tokenValueRegion);
		
		var tokenNameRegion = $$Weather-Card-Token-Name-region.region;
		tokenNameRegion.y += $BackTokensOffset * 1;
		backTokenNameBox.markupText = $BackTokenName;
		backTokenNameBox.draw(g, tokenNameRegion);
	}
	
	// Draw Card Text
	backTextBox.markupText = $BackCardText;
	backTextBox.setLineTightness(EBRObject.bodyFontTightness);
	
	var backTextBoxRegion = diy.settings.getRegion('Weather-Card-Text-region');
	backTextBoxRegion.y += totalOffset;
	backTextBoxRegion.height -= totalOffset;
	
	backTextBox.draw(g, backTextBoxRegion);
	
	// Draw challenge boxes
	//drawChallengeEffects(g, diy, sheet, 'Weather');
	drawChallengeEffects(g, diy, sheet, 'Weather', [ $BackSunEffect, $BackMountainEffect, $BackCrestEffect ]);
	
	// Draw Artist credit
	backArtistTextBox.markupText = $BackArtist;
	sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Artist-Icon.png'), $$Weather-Card-Artist-Icon-region.region );
	backArtistTextBox.draw(g, $$Weather-Card-Artist-region.region);
	
	// Draw Set info
	backSetInfoTextBox.markupText = $BackSetInfo;
	backSetInfoTextBox.draw(g, $$Weather-Card-Set-Info-region.region);
	
	// Draw Copyright
	backCopyrightTextBox.markupText = $BackCopyright;
	backCopyrightTextBox.draw(g, $$Weather-Card-Copyright-region.region);
}

function onClear() {
    setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList);
}

function onWrite(diy, oos) {
	writePortraits( oos, PortraitTypeList );
}

function setDefaults() {
	// I have found no way to get bindings to work with an array, so at this point I give
	// up because all of this magic string nonsense instead of sending object references
	// is not worth fiddling with.
	
	// Settings for the card front
	$FrontType = 'Weather';
	$FrontTraits = '';
	
	$FrontHeightOffset = '0';
	
	$FrontTokenValue = '-';
	$FrontTokenName = '';
	$FrontAreTokensPerRanger = '0';
	$FrontTokensOffset = '0';
	
	$FrontCardText = '';
	
	$FrontSunEffect = '';
	$FrontMountainEffect = '';
	$FrontCrestEffect = '';
	
	$FrontSetInfo = '<bgcolor #000><white> ABC </white></bgcolor> WEATHER - 1 / ?';
	$FrontArtist = '';
	$FrontCopyright = '#EBR Homebrew';
	
	// Settings for the card back
	$BackTitle = '';
	$BackType = 'Weather';
	$BackTraits = '';
	
	$BackHeightOffset = '0';
	
	$BackTokenValue = '-';
	$BackTokenName = '';
	$BackAreTokensPerRanger = '0';
	$BackTokensOffset = '0';
	
	$BackCardText = '';
	
	$BackSunEffect = '';
	$BackMountainEffect = '';
	$BackCrestEffect = '';
	
	$BackSetInfo = '<bgcolor #000><white> ABC </white></bgcolor> WEATHER - 2 / ?';
	$BackArtist = '';
	$BackCopyright = '#EBR-Homebrew';
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