importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );

importClass(arkham.component.DefaultPortrait);

const CardType = 'Path-Card';

const PortraitTypeList = [ 'Portrait-Front', 'Set-Front' ];

function create( diy ) {
	diy.faceStyle = FaceStyle.PLAIN_BACK;
	diy.frontTemplateKey = "Path-Card-Default";
	diy.backTemplateKey = "Path-Card-Back-Default";
	
	diy.name = '';
	setDefaults();
	
	createPortraits( diy, PortraitTypeList );
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 1;
}

function setDefaults() {
	$AreaIndicator = 'Up';
	
	$HeightOffset = '0';
	
	$TokenValue = '-';
	$TokenName = '';
	$Type = '';
	$Traits = '';
	$JournalNum = '';
	
	$Presence = '-';
	$PresencePerRanger = '0';
	$Harm = '-';
	$HarmPerRanger = '0';
	$Progress = '-';
	$ProgressPerRanger = '0';
	
	$CardText = '';
	
	$SunEffect = '';
	$MountainEffect = '';
	$CrestEffect = '';
	
	$PathSet = 'Generic';
	
	$SetInfo = '<bgcolor #000><white> ABC </white></bgcolor> WOODS - 1 / ?';
	$Artist = '';
	$Copyright = '#EBR-Homebrew';
}

function createInterface( diy, editor ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	let bindings = new Bindings(editor, diy);
	
	///// General Card Info Tab /////
	let generalStack = new Stack();
	
	// Title Panel
	let panel = new Grid("fillx");
	let nameField = textField();
	diy.setNameField(nameField);
	let nameLabel = label("&Name", nameField);
	panel.place(nameLabel, "split", nameField, "growx, wrap");
	panel.setTitle("Title");
	generalStack.add(panel);
	
	// Basic Data Panel
	panel = new Grid("fillx");
	panel.setTitle("Basic Data");
	
	var cardTypeField = textField();
	bindings.add("Type", cardTypeField, [0]);
	panel.place("Card Type", 'align right', cardTypeField, 'pushx, growx, sizegroup sp');
	
	var traitsField = textField();
	bindings.add("Traits", traitsField, [0]);
	panel.place("Traits", 'align right, gapx 10', traitsField, 'wrap, pushx, growx, sizegroup sp');
	
	var tokenValueList = new comboBox( EBRObject.comboTokens, null );
	bindings.add("TokenValue", tokenValueList, [0]);
	panel.place("Token Value", 'align right', tokenValueList, 'pushx, growx, sizegroup sp');
	
	var tokenNameField = textField();
	bindings.add("TokenName", tokenNameField, [0]);
	panel.place("Token Name", 'align right, gapx 10', tokenNameField, 'wrap, pushx, growx, sizegroup sp');
	
	var areaList = new comboBox( EBRObject.comboPathCardArea, null );
	bindings.add("AreaIndicator", areaList, [0]);
	panel.place("Area", 'align right', areaList, 'pushx, growx, sizegroup sp');
	
	var journalNumField = textField();
	bindings.add("JournalNum", journalNumField, [0]);
	panel.place("JournalNumber", 'align right, gapx 10', journalNumField, 'wrap, pushx, growx, sizegroup sp');
	
	generalStack.add(panel);
	
	// Set info panel
	panel = new Grid("fillx");
	panel.setTitle("Set Info");
	
	let setInfoField = textField();
	bindings.add("SetInfo", setInfoField, [0]);
	panel.place("Set Info", "split", setInfoField, "growx, wrap");
	
	let artistField = textField();
	bindings.add("Artist", artistField, [0]);
	panel.place("Artist", "split", artistField, "growx, wrap");
	
	let copyrightField = textField();
	bindings.add("Copyright", copyrightField, [0]);
	panel.place(
		"Copyright", "split", copyrightField, "pushx, growx",
		new tipButton( @( 'EBR-CopyrightTip' ) ), 'aligny top, gaptop 5'
	);
	
	generalStack.add(panel);
	
	// Thresholds Panel
	panel = new Grid("fillx");
	panel.setTitle("Card Thresholds");
	
	var perRangerIcon = ImageUtils.createIcon(ImageUtils.get('ebr/icons/PerRanger.png'), 12, 12);
	
	var presenceList = new comboBox( EBRObject.comboCost, null );
	bindings.add("Presence", presenceList, [0]);
	var perRangerPresenceButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("PresencePerRanger", perRangerPresenceButton, [0] );
	panel.place("Presence", 'align right', presenceList, 'pushx, growx', perRangerPresenceButton, 'wmax 35, hmin 25, hmax 25');
	
	var progressList = new comboBox( EBRObject.comboProgress, null );
	bindings.add("Progress", progressList, [0]);
	var perRangerProgressButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("ProgressPerRanger", perRangerProgressButton, [0] );
	panel.place("Progress", 'align right', progressList, 'pushx, growx', perRangerProgressButton, 'wrap, wmax 35, hmin 25, hmax 25');
	
	var harmList = new comboBox( EBRObject.comboCost, null );
	bindings.add("Harm", harmList, [0]);
	var perRangerHarmButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("HarmPerRanger", perRangerHarmButton, [0] );
	panel.place("Harm", 'align right', harmList, 'pushx, growx', perRangerHarmButton, 'wmax 35, hmin 25, hmax 25');
	
	generalStack.add(panel);
	
	///// Card Text Tab /////
	let contentStack = new Stack();
	
	// Card Height Offset panel
	panel = new Grid("fillx");
	panel.setTitle("Card Body Height offset");
	
	let offsetCounter = spinner( 0, 100 );
	bindings.add("HeightOffset", offsetCounter, [0]);
	panel.place( "Offset (0-100)", "wmax 100", offsetCounter, "pushx, align left");
	
	contentStack.add(panel);
	
	// Card Text panel
	panel = new Grid("fillx");
	panel.setTitle("Card Text");
	
	let cardTextField = textArea("", 15, 0, true);
	bindings.add("CardText", cardTextField, [0]);
	let cardTextLabel = label("&Card Text", cardTextField);
	panel.place(
		cardTextLabel, "wrap", cardTextField, "spany 2, pushx, growx",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
    contentStack.add(panel);
    
    ///// Challenge Effect Tab /////
    // TODO: Consolidate with mission card code
	let challengeEffectStack = new Stack();
	
	panel = new Grid("fillx");
	panel.setTitle("Challenge Effects");
	
	let sunEffectField = textArea("", 5, 0, true);
	bindings.add("SunEffect", sunEffectField, [0]);
	panel.place("Sun Effect", "wrap", sunEffectField, "growx, wrap");
	
	let mountainEffectField = textArea("", 5, 0, true);
	bindings.add("MountainEffect", mountainEffectField, [0]);
	panel.place("Mountain Effect", "wrap", mountainEffectField, "growx, wrap");
	
	let crestEffectField = textArea("", 5, 0, true);
	bindings.add("CrestEffect", crestEffectField, [0]);
	panel.place("Crest Effect", "wrap", crestEffectField, "growx, wrap");
	
	challengeEffectStack.add(panel);
	
	///// Collection Tab /////
	let pathSetStack = new Stack();
	
	panel = new Grid("fillx");
	panel.setTitle("Path Set");
	
	var pathSetGrid =  new Grid();
	pathSetGrid.setTitle("Path Set");
	
	var setList = new comboBox( EBRObject.comboPathSet, null );
	bindings.add("PathSet", setList, [0]);
	pathSetGrid.place( "Path Set", 'align right', setList, 'wrap, pushx, growx, span 3');
	
	var imagePanel = new portraitPanel( diy, 1, "Custom Path Set" );
	
	panel.place(pathSetGrid, 'wrap, pushx, growx', imagePanel, 'wrap, pushx, growx' );
	
	pathSetStack.add(panel);
	
	///// Portrait Tab /////
	let portraitStack = new Stack();
	panel = new Grid("fillx");
	imagePanel = new portraitPanel( diy, 0, "Portrait Adjustment" );
	panel.place( imagePanel, 'wrap, pushx, growx' );
	portraitStack.add(panel);
	
	// Add all tabs to the editor in reverse display order
	portraitStack.editorTabScrolling = true;
    portraitStack.addToEditor(editor, "Portrait", null, null, 0);
	
	pathSetStack.editorTabScrolling = true;
    pathSetStack.addToEditor(editor, "Path Set", null, null, 0);
	
	challengeEffectStack.editorTabScrolling = true;
    challengeEffectStack.addToEditor(editor, "Challenge Effects", null, null, 0);
	
	contentStack.editorTabScrolling = true;
    contentStack.addToEditor(editor, "Content", null, null, 0);
	
	generalStack.editorTabScrolling = true;
    generalStack.addToEditor(editor, "General", null, null, 0);
    
    bindings.bind();
}

let titleBox, typeBox, tokenValueBox, tokenNameBox, journalIconBox, journalTextBox,
	presenceTextBox, presencePerRangerTextBox, progressTextBox, progressPerRangerTextBox, harmTextBox, harmPerRangerTextBox, 
	textBox, artistTextBox, setInfoTextBox, copyrightTextBox;

function createFrontPainter( diy, sheet ) {
	
	titleBox = createTextBox(diy, sheet, 'Path-Card-Title');
	
	typeBox = createTextBox(diy, sheet, 'Path-Card-Type');
	
	tokenValueBox = createTextBox(diy, sheet, 'Path-Card-Token-Value');
	
	tokenNameBox = createTextBox(diy, sheet, 'Path-Card-Token-Name');
	
	journalIconBox = createTextBox(diy, sheet, 'Path-Card-Journal-Icon');
	journalTextBox = createTextBox(diy, sheet, 'Path-Card-Journal-Text');
	initBodyTags(diy, journalIconBox);
	
	textBox = createTextBox(diy, sheet, 'Path-Card-Text');
	
	presenceTextBox = createTextBox(diy, sheet, 'Path-Card-Threshold-Text');
	
	presencePerRangerTextBox = createTextBox(diy, sheet, 'Path-Card-Threshold-PerRanger-Text');
	
	progressTextBox = createTextBox(diy, sheet, 'Path-Card-Threshold-Text');
	
	progressPerRangerTextBox = createTextBox(diy, sheet, 'Path-Card-Threshold-PerRanger-Text');
	
	harmTextBox = createTextBox(diy, sheet, 'Path-Card-Threshold-Text');
	
	harmPerRangerTextBox = createTextBox(diy, sheet, 'Path-Card-Threshold-PerRanger-Text');
	
	challengeTextBox = createTextBox(diy, sheet, 'Mission-Card-Challenge');
	
	artistTextBox = createTextBox(diy, sheet, 'Path-Card-Artist');
	
	setInfoTextBox = createTextBox(diy, sheet, 'Path-Card-Set-Info');
	
	copyrightTextBox = createTextBox(diy, sheet, 'Path-Card-Copyright');
	
	initBodyTags(diy, challengeTextBox);
	initBodyStyleTags(diy, progressTextBox);
	initBodyTags(diy, textBox);
	initRangerCardBodyTags(diy, textBox);
	initSpecialBodyTags(diy, textBox, 'Path');
	initCopyrightTags(diy, copyrightTextBox);
}

function createBackPainter( diy, sheet ) { }


function paintFront( g, diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	var totalOffset = $HeightOffset*5;
	
	PortraitList[0].paint( g, sheet.getRenderTarget() );
	
	// Paint Top Header Image
	var image = ImageUtils.get('ebr/overlays/path/Path-Card-Header.png');
	var w = image.getWidth();
	var h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	// Paint Body Image
	image = ImageUtils.get('ebr/overlays/path/Path-Card-Body.png');
	w = image.getWidth();
	h = image.getHeight();
	var y = 337 + totalOffset;
	sheet.paintImage( g, image, new Region(0, y, w, h) );
	
	// Draw Title
	titleBox.markupText = diy.name;
	var pathCardTitleRegion = $$Path-Card-Title-region.region;
	if ($Presence != '-') {
		pathCardTitleRegion.width -= 50;
	}
	titleBox.draw(g, pathCardTitleRegion);
	
	// Draw Type and Traits
	var typeText = $Type;
	if($Traits != '') {
		typeText = typeText + ' <i>/ ' + $Traits + '</i>';
	}
	typeBox.markupText = typeText;
	var pathCardTypeRegion = $$Path-Card-Type-region.region;
	if ($Presence != '-' || $JournalNum != '') {
		pathCardTypeRegion.width -= 50;
	}
	typeBox.draw(g, pathCardTypeRegion);
	
	if($JournalNum != '') {
		journalIconBox.markupText = '<size 15.0><jou></size>';
		journalIconBox.draw(g, $$Path-Card-Journal-Icon-region.region);
		journalTextBox.markupText = $JournalNum;
		journalTextBox.draw(g, $$Path-Card-Journal-Text-region.region);	
	}
	
	// Draw area icon
	if ($PathSet == 'CustomSet') {
		PortraitList[1].paint( g, sheet.getRenderTarget() );
	}
	else {
		sheet.paintImage( g, ImageUtils.get('ebr/icons/path-sets/' + $PathSet + '.png'), $$Path-Card-Set-Icon-region.region );
	}
	
	// Draw area icon
	sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Arrow-' + $AreaIndicator + '.png'), $$Path-Card-Area-Icon-region.region );
	
	// Draw Token Box
	if ($TokenValue != '-') {
		// TO DO: Figure out how to change the name color by aspect
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Path-Token-Box.png'), $$Path-Card-Token-Box-region.region );
		tokenValueBox.markupText = $TokenValue;
		tokenValueBox.draw(g, $$Path-Card-Token-Value-region.region);
		tokenNameBox.markupText = $TokenName;
		tokenNameBox.draw(g, $$Path-Card-Token-Name-region.region);
	}
	
	// Draw Threshold boxes
	if ($Presence != '-') {
		drawThresholdValue(g, diy, sheet, 'Path', 'Presence', 'Presence', presenceTextBox, presencePerRangerTextBox, 0);
	}
	
	var harmRegionName = 'Threshold1';
	if ($Progress != '-') {
		harmRegionName = 'Threshold2';
		drawThresholdValue(g, diy, sheet, 'Path', 'Progress', 'Threshold1', progressTextBox, progressPerRangerTextBox, totalOffset);
	}
	if ($Harm != '-') {
		drawThresholdValue(g, diy, sheet, 'Path', 'Harm', harmRegionName, harmTextBox, harmPerRangerTextBox, totalOffset);
	}
	
	// Draw Card Text
	textBox.markupText = $CardText;
	textBox.setLineTightness(EBRObject.bodyFontTightness);
	
	var textBoxRegion = diy.settings.getRegion('Path-Card-Text-region');
	textBoxRegion.y += totalOffset;
	textBoxRegion.height -= totalOffset;
	
	textBox.draw(g, textBoxRegion);
	
	// Draw challenge boxes
	drawChallengeEffects(g, diy, sheet, 'Path', [ $SunEffect, $MountainEffect, $CrestEffect ]);
	
	// Draw Artist credit
	artistTextBox.markupText = $Artist;
	sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Artist-Icon.png'), $$Path-Card-Artist-Icon-region.region );
	artistTextBox.draw(g, $$Path-Card-Artist-region.region);
	
	// Draw Set info
	setInfoTextBox.markupText = $SetInfo;
	setInfoTextBox.draw(g, $$Path-Card-Set-Info-region.region);
	
	// Draw Copyright
	copyrightTextBox.markupText = $Copyright;
	copyrightTextBox.draw(g, $$Path-Card-Copyright-region.region);
}

function paintBack( g, diy, sheet ) { }

function onClear() { 
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead( diy, oos ) {
	readPortraits( diy, oos, PortraitTypeList);
	//createPortraits( diy, PortraitTypeList );
}

function onWrite( diy, oos ) {
	writePortraits( oos, PortraitTypeList );
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