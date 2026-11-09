importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary('diy');
useLibrary('ui');
useLibrary('markup');
useLibrary('imageutils');

importClass(arkham.component.DefaultPortrait);

const CardType = 'Location-Card';
const PortraitTypeList = [ 'Portrait-Front', 'BackPortrait-Back', 'LocationIcon-Back' ];

function create(diy) {
    diy.faceStyle = FaceStyle.TWO_FACES;
	diy.frontTemplateKey = "Location-Card-Default";
	diy.backTemplateKey = "Location-Card-Default";
	
	diy.name = '';
	setDefaults();
		
	createPortraits( diy, PortraitTypeList );
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 1.2;
}

function createInterface(diy, editor) {
    var EBRObject = Eons.namedObjects.EBRObject;

    var bindings = new Bindings(editor, diy);
    
    var settingsStack = new Stack('fillx');
    
    let panel = new Grid("fillx");
    var perRangerIcon = ImageUtils.createIcon(ImageUtils.get('ebr/icons/PerRanger.png'), 12, 12);
    
    let nameField = textField();
	diy.setNameField(nameField);
	let nameLabel = label("&Name", nameField);
	panel.place(nameLabel, "split", nameField, "spanx 2, growx, wrap");

	let cardTypeField = textField('', 20);
	bindings.add("Type", cardTypeField, [0]);
	panel.place("Card Type", 'split', cardTypeField, '');
	
	let traitsField = textField('', 25);
	bindings.add("Traits", traitsField, [0]);
	panel.place("Traits", 'split', traitsField, 'spanx 2, wrap');
	
	// Thresholds Panel
	let thresholdSubPanel = new Grid("fillx");
	thresholdSubPanel.setTitle("Threshold");
	
	var presenceList = new comboBox( EBRObject.comboCost, null );
	bindings.add("Presence", presenceList, [0]);
	var perRangerPresenceButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("IsPresencePerRanger", perRangerPresenceButton, [0] );
	thresholdSubPanel.place("Presence", 'align right', presenceList, 'pushx, growx', perRangerPresenceButton, 'wmax 35, hmin 25, hmax 25');
	
	var progressList = new comboBox( EBRObject.comboProgress, null );
	bindings.add("Progress", progressList, [0]);
	var perRangerProgressButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("IsProgressPerRanger", perRangerProgressButton, [0] );
	thresholdSubPanel.place("Progress", 'align right', progressList, 'pushx, growx', perRangerProgressButton, 'wrap, wmax 35, hmin 25, hmax 25');
	
	panel.place(thresholdSubPanel, 'wrap');

	// Footer Panel
	let footerSubPanel = new Grid("fillx");
	footerSubPanel.setTitle("Footer");
	
	let setInfoField = textField();
	bindings.add("SetInfo", setInfoField, [0]);
	footerSubPanel.place("Set Info", "split", setInfoField, "spanx 2, wrap, growx");
	
	let artistField = textField('', 25);
	bindings.add("Artist", artistField, [0]);
	footerSubPanel.place("Artist", "split", artistField, "growx");
	
	let copyrightField = textField('', 15);
	bindings.add("Copyright", copyrightField, [0]);
	footerSubPanel.place(
		"Copyright", "split", copyrightField, "spany 2",
		new tipButton( @( 'EBR-CopyrightTip' ) ), 'aligny top, gaptop 5'
	);
	panel.place(footerSubPanel, 'wrap');

	panel.editorTabScrolling = true;
    panel.addToEditor(editor, 'Headings');
    
    ///////////////////////////
	///// Card Text panel /////
	///////////////////////////
	panel = new Grid("fillx");
	
	let offsetCounter = spinner( 0, 100 );
	bindings.add("Offset", offsetCounter, [0]);
	panel.place( "Offset (0-100)", "wmax 100", offsetCounter, "wrap, pushx, align left");
	
	let cardTextField = textArea("", 15, 0, true);
	bindings.add("RulesText", cardTextField, [0]);
	let cardTextLabel = label("&Card Text", cardTextField);
	panel.place(
		cardTextLabel, 'wrap, spanx 3',
		cardTextField, "growx, spanx 2, spany 2",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
	panel.place(' ', 'wrap'); //These effectively just generate a new line for some spacing
	panel.place('----- Challenge Effects -----', 'wrap');
	panel.place(' ', 'wrap');
	
	let sunEffectField = textArea("", 5, 0, true);
	bindings.add("SunEffect", sunEffectField, [0]);
	panel.place("Sun Effect", "wrap", sunEffectField, "spanx 3, growx, wrap");
	
	let mountainEffectField = textArea("", 5, 0, true);
	bindings.add("MountainEffect", mountainEffectField, [0]);
	panel.place("Mountain Effect", "wrap", mountainEffectField, "spanx 3, growx, wrap");
	
	let crestEffectField = textArea("", 5, 0, true);
	bindings.add("CrestEffect", crestEffectField, [0]);
	panel.place("Crest Effect", "wrap", crestEffectField, "spanx 3, growx, wrap");
	
	let arrivalJournalField = textField('', 25);
	bindings.add("ArrivalJournalId", arrivalJournalField, [0]);
	panel.place("Arrival Journal No.", 'split', arrivalJournalField, 'spanx 2, wrap');
	
	let arrivalRulesField = textArea("", 15, 0, true);
	bindings.add("ArrivalRules", arrivalRulesField, [0]);
	let arrivalRulesLabel = label("&Arrival Instructions", arrivalRulesField);
	panel.place(
		arrivalRulesLabel, 'wrap, spanx 3',
		arrivalRulesField, "growx, spanx 2, spany 2",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
	panel.editorTabScrolling = true;
	panel.addToEditor(editor, "Text & Effects");
	
	//////////////////////////
	//////// Icon Tab ////////
	//////////////////////////
	let setStack = new Stack();
	
	panel = new Grid("fillx");
	panel.setTitle("Location Icon");
	
	var pathSetGrid =  new Grid();
	pathSetGrid.setTitle("Location Icon");
	
	var setList = new comboBox( EBRObject.comboLocationSet, null );
	bindings.add("LocationIcon", setList, [0]);
	pathSetGrid.place( "Location Icon", 'align right', setList, 'wrap, pushx, growx, span 3');
	
	var imagePanel = new portraitPanel( diy, 2, "Custom Icon" );
	
	panel.place(pathSetGrid, 'wrap, pushx, growx', imagePanel, 'wrap, pushx, growx' );
	
	setStack.editorTabScrolling = true;
	setStack.add(panel);
	setStack.addToEditor(editor, "Icon");

	////////////////////////
	///// Portrait Tab /////
	////////////////////////
	panel = new Grid("fillx");
	let frontImagePanel = new portraitPanel( diy, 0, "Front Portrait Adjustment" );
	panel.place( frontImagePanel, 'wrap, pushx, growx' );
	
	let backImagePanel = new portraitPanel( diy, 1, "Back Portrait Adjustment" );
	panel.place( backImagePanel, 'wrap, pushx, growx' );
	
	panel.editorTabScrolling = true;	
	panel.addToEditor(editor, "Portraits");

    bindings.bind();
}

var frontTitleBox, frontTraitsBox, presenceTextBox, presencePerRangerTextBox, rulesTextBox, challengeTextBox,
 progressTextBox, artistTextBox, setInfoTextBox, copyrightTextBox;

function createFrontPainter(diy, sheet) {
    frontTitleBox = createTextBox(diy, sheet, 'Location-Card-Front-Title');
	frontTraitsBox = createTextBox(diy, sheet, 'Location-Card-Front-Type');
	
	presenceTextBox = createTextBox(diy, sheet, 'Location-Card-Threshold-Text');
	presencePerRangerTextBox = createTextBox(diy, sheet, 'Location-Card-Threshold-PerRanger-Text');
	progressTextBox = createTextBox(diy, sheet, 'Location-Card-Threshold-Text');
	
	rulesTextBox = createTextBox(diy, sheet, 'Location-Card-Rules-Text');
	challengeTextBox = createTextBox(diy, sheet, 'Location-Card-Challenge');
	
	artistTextBox = createTextBox(diy, sheet, 'Location-Card-Artist');
	setInfoTextBox = createTextBox(diy, sheet, 'Location-Card-Set-Info');
	copyrightTextBox = createTextBox(diy, sheet, 'Location-Card-Copyright');
	
	initBodyTags(diy, rulesTextBox);
	initSpecialBodyTags(diy, rulesTextBox, 'Location');
	initBodyTags(diy, challengeTextBox);
}

var backTitleBox, backTraitsBox, arrivalTextBox, arrivalJournalNumberBox;

function createBackPainter(diy, sheet) {
    backTitleBox = createTextBox(diy, sheet, 'Location-Card-Back-Title');
	backTraitsBox = createTextBox(diy, sheet, 'Location-Card-Back-Type');
	arrivalTextBox = createTextBox(diy, sheet, 'Location-Card-Arrival-Instructions');
	arrivalJournalNumberBox = createTextBox(diy, sheet, 'Location-Card-Arrival-Journal-Number');
	
	initBodyTags(diy, arrivalTextBox);
	initSpecialBodyTags(diy, arrivalTextBox, 'Location');
	initBodyTags(diy, arrivalJournalNumberBox);
}


function paintFront(g, diy, sheet) {
    // Paint Body Image
	let image = ImageUtils.get('ebr/templates/Location-Card-Front.png');
	w = image.getWidth();
	h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );

	PortraitList[0].paint( g, sheet.getRenderTarget() );
	
	// Paint Body Image
	image = ImageUtils.get('ebr/overlays/location/Location-Card-Body.png');
	sheet.paintImage( g, image, new Region(125, $Offset*5, image.getWidth(), image.getHeight()) );

    g.setPaint(Color.BLACK);
    
    // Draw Title
	frontTitleBox.markupText = diy.name;
	drawRotatedTextBox(g, $$Location-Card-Front-Title-region.region, frontTitleBox);
	
	// Draw Type and Traits
	frontTraitsBox.markupText = $Type + ($Traits != '' ? ' <i>/ ' + $Traits + '</i>' : ''); // Adds traits after type (in italics with a starting '/')
	drawRotatedTextBox(g, $$Location-Card-Front-Type-region.region, frontTraitsBox);
	
	// Draw Threshold boxes
	if ($Presence != '-') {
		let presenceOverlayPath = $Presence == '<i>/</i>' ? 'ebr/overlays/thresholds/Dark-Presence-Box.png' :
			'ebr/overlays/thresholds/Presence-Box.png';
		drawThresholdValueFixed(g, diy, sheet, ImageUtils.get(presenceOverlayPath),
			ImageUtils.get('ebr/overlays/thresholds/Path-Threshold-Frame.png'), $$Location-Card-Presence-region.region, 
			$Presence, $IsPresencePerRanger, presenceTextBox, 0);
	}
	if ($Progress != '-') {
		let progressOverlayPath = $Progress == '<i>/</i>' ? 'ebr/overlays/thresholds/Dark-Progress-Box.png' :
			'ebr/overlays/thresholds/Progress-Box.png';
		drawThresholdValueFixed(g, diy, sheet, ImageUtils.get(progressOverlayPath),
			ImageUtils.get('ebr/overlays/thresholds/Path-Threshold-Frame.png'), $$Location-Card-Progress-region.region, 
			$Progress, $IsProgressPerRanger, progressTextBox, $Offset*5);
	}
	
	// Draw Card Text
	var EBRObject = Eons.namedObjects.EBRObject;
	rulesTextBox.markupText = $RulesText;
	rulesTextBox.setLineTightness(EBRObject.bodyFontTightness);
	
	var textBoxRegion = diy.settings.getRegion('Location-Card-Rules-Text-region');
	textBoxRegion.y += $Offset*5;
	textBoxRegion.height -= $Offset*5;
	rulesTextBox.draw(g, textBoxRegion);
	
	// Draw challenge boxes
	drawChallengeEffects(g, diy, sheet, 'Location', [ $SunEffect, $MountainEffect, $CrestEffect ]);
	
	// Draw Artist credit
	artistTextBox.markupText = $Artist;
	sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Artist-Icon.png'), $$Location-Card-Artist-Icon-region.region );
	artistTextBox.draw(g, $$Location-Card-Artist-region.region);
	
	// Draw Set info
	setInfoTextBox.markupText = $SetInfo;
	setInfoTextBox.draw(g, $$Location-Card-Set-Info-region.region);
	
	// Draw Copyright
	copyrightTextBox.markupText = $Copyright;
	copyrightTextBox.draw(g, $$Location-Card-Copyright-region.region);
}

function paintBack(g, diy, sheet) {
    // Paint Body Image
	let image = ImageUtils.get('ebr/templates/Location-Card-Back.png');
	sheet.paintImage( g, image, new Region(0, 0, image.getWidth(), image.getHeight()) );
	
	PortraitList[1].paint( g, sheet.getRenderTarget() );

	// Paint Portrait Transparency Overlay
	image = ImageUtils.get('ebr/overlays/location/Location-Back-Art-Overlay.png');
	sheet.paintImage( g, image, new Region(0, 135, image.getWidth(), image.getHeight()) );
	
	// Paint Arrival Text Box
	image = ImageUtils.get('ebr/overlays/location/Location-Back-Arrival-Box.png');
	sheet.paintImage( g, image, new Region(470, 125, image.getWidth(), image.getHeight()) );

    g.setPaint(Color.BLACK);
    
    // Draw Title
	backTitleBox.markupText = diy.name;
	backTitleBox.draw(g, $$Location-Card-Back-Title-region.region);
	
	// Draw Type and Traits
	backTraitsBox.markupText = $Type + ($Traits != '' ? ' <i>/ ' + $Traits + '</i>' : ''); // Adds traits after type (in italics with a starting '/')
	backTraitsBox.draw(g, $$Location-Card-Back-Type-region.region);
	
	// Draw area icon
	if ($LocationIcon == 'CustomLocation') {
		PortraitList[2].paint( g, sheet.getRenderTarget() );
	}
	else {
		sheet.paintImage( g, ImageUtils.get('ebr/icons/path-sets/' + $LocationIcon + '.png'), $$Location-Card-Location-Icon-region.region );
	}
	
	// Draw Arrival Header
	arrivalJournalNumberBox.markupText = '<size 14.0><jou></size> ' + $ArrivalJournalId;
	arrivalJournalNumberBox.draw(g, $$Location-Card-Arrival-Journal-Number-region.region);
	
	// Draw Arrival Instructions
	var EBRObject = Eons.namedObjects.EBRObject;
	arrivalTextBox.markupText = $ArrivalRules;
	arrivalTextBox.setLineTightness(EBRObject.bodyFontTightness);
	arrivalTextBox.draw(g, $$Location-Card-Arrival-Instructions-region.region);
}

function onClear() {
    // this us called when the user issues a Clear command;
    // you should reset all of of the card's attributes to
    // a neutral state (the name and comments are cleared for you)
    $Countdown = '1';
}

function setDefaults() {
	$Type = 'Location';
	$Traits = '';
	
	$Presence = '1';
	$IsPresencePerRanger = 0; // The UI control uses 1/0 for true/false
	$Progress = '1';
	$IsProgressPerRanger = 1; // The UI control uses 1/0 for true/false
	
	$Artist = '';
	$SetInfo = '<bgcolor #000> <white>ABC</white> </bgcolor> LOCATIONS - 1 / ?';
	$Copyright = '#EBR-Homebrew';
	
	$Offset = '90';
	$RulesText = '';
	$SunEffect = '';
	$MountainEffect = '';
	$CrestEffect = '';
	
	$LocationIcon = 'Branch';
	
	$ArrivalJournalId = '';
	$ArrivalRules = '';
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList );
}
function onWrite(diy, oos) {
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