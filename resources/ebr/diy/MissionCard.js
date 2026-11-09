importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );

importClass(arkham.component.DefaultPortrait);

const CardType = 'Mission-Card';

const PortraitTypeList = [ 'Portrait-Front' ];

function create( diy ) {
	// TO DO: Figure out back. Potentially Mission/Mission or Mission/Asset
	diy.faceStyle = FaceStyle.ONE_FACE;
	
	diy.frontTemplateKey = "Mission-Card-Default";
	// diy.backTemplateKey = "Ranger-Card-Back-Default";
	
	diy.name = '';
	setDefaults();
	
	createPortraits( diy, PortraitTypeList );
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 2;
}

function setDefaults() {
	$Type = '';
	$Traits = '';
	$MissionFrame = 'ValleyRegular';
	
	$CardText = '';
	$CardText2 = '';
	
	$Objective1Type = '-';
	$Objective1Name = '';
	
	$Objective2Type = '-';
	$Objective2Name = '';
	
	$Objective3Type = '-';
	$Objective3Name = '';
	
	$SunEffect = '';
	$MountainEffect = '';
	$CrestEffect = '';
	
	$SetInfo = '<bgcolor #000><white> ABC </white></bgcolor> MISSION - 1 OF ?';
	$Copyright = '#EBR-Homebrew';
}

function createInterface( diy, editor ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	let bindings = new Bindings(editor, diy);
	
	///// General Card Info Tab /////
	let generalStack = new Stack();
	
	// Title Panel
	let panel = new Grid("fillx");
	panel.setTitle("Title");
	
	let nameField = textField();
	diy.setNameField(nameField);
	let nameLabel = label("&Name", nameField);
	panel.place(nameLabel, "align right", nameField, "span 3, growx, wrap");
	
	var cardTypeField = textField();
	bindings.add("Type", cardTypeField, [0]);
	panel.place("Card Type", 'align right', cardTypeField, 'pushx, growx, sizegroup sp');
	
	var traitsField = textField();
	bindings.add("Traits", traitsField, [0]);
	panel.place("Traits", 'align right, gapx 10', traitsField, 'wrap, pushx, growx, sizegroup sp');
	
	generalStack.add(panel);
	
	// Set info panel
	panel = new Grid("fillx");
	panel.setTitle("Set Info");
	
	let setInfoField = textField();
	bindings.add("SetInfo", setInfoField, [0]);
	panel.place("Set Info", "split", setInfoField, "growx, wrap");
	
	let copyrightField = textField();
	bindings.add("Copyright", copyrightField, [0]);
	panel.place(
		"Copyright", "split", copyrightField, "pushx, growx",
		new tipButton( @( 'EBR-CopyrightTip' ) ), 'aligny top, gaptop 5'
	);
	
	generalStack.add(panel);
	
	///// Card Text Tab /////
	let contentStack = new Stack();
	
	// Card Text Panel
	panel = new Grid("fillx");
	panel.setTitle("Card Text");
	
	let cardTextField = textArea("", 15, 0, true);
	bindings.add("CardText", cardTextField, [0]);
	let cardTextLabel = label("&Card Text", cardTextField);
	panel.place(
		cardTextLabel, "wrap", cardTextField, "spany 3, spanx 2, pushx, growx",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-MissionCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
	var objectiveTypeList1 = new comboBox( EBRObject.comboMissionObjectiveType, null );
	bindings.add("Objective1Type", objectiveTypeList1, [0]);
	var objectiveTextField1 = textField("", 20);
	bindings.add("Objective1Name", objectiveTextField1, [0]);
	
	var objectiveTypeList2 = new comboBox( EBRObject.comboMissionObjectiveType, null );
	bindings.add("Objective2Type", objectiveTypeList2, [0]);
	var objectiveTextField2 = textField("", 20);
	bindings.add("Objective2Name", objectiveTextField2, [0]);
	
	var objectiveTypeList3 = new comboBox( EBRObject.comboMissionObjectiveType, null );
	bindings.add("Objective3Type", objectiveTypeList3, [0]);
	var objectiveTextField3 = textField("", 20);
	bindings.add("Objective3Name", objectiveTextField3, [0]);
	
	panel.place(
		"Objective 1", "wrap", objectiveTypeList1, "pushx, growx, gapx 1", objectiveTextField1, "pushx, growx, wrap",
		"Objective 2", "wrap", objectiveTypeList2, "pushx, growx, gapx 1", objectiveTextField2, "pushx, growx, wrap",
		"Objective 3", "wrap", objectiveTypeList3, "pushx, growx, gapx 1", objectiveTextField3, "pushx, growx, wrap"
	);
	
	let cardTextField2 = textArea("", 15, 0, true);
	bindings.add("$CardText2", cardTextField2, [0]);
	
	panel.place("Card Text 2", "wrap", cardTextField2, "spanx 2, growx, wrap");
	
	contentStack.add(panel);
	
	///// Challenge Effect Tab /////
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
	
	///// Portrait Tab //////
	let portraitStack = new Stack();
	
	var frameList = new comboBox( EBRObject.comboMissionFrame, null );
	bindings.add("MissionFrame", frameList, [0]);
	portraitStack.place("Mission Type", 'align right', frameList, 'pushx, growx, sizegroup sp');
	
	imagePanel = new portraitPanel( diy, 0, "Portrait Adjustment" );
	//panel.place( imagePanel, 'wrap, pushx, growx' );
	portraitStack.add(imagePanel);
	
	// Add all tabs to the editor in reverse display order
	portraitStack.editorTabScrolling = true;
	portraitStack.addToEditor(editor, "Portrait", null, null, 0);
	
	challengeEffectStack.editorTabScrolling = true;
    challengeEffectStack.addToEditor(editor, "Challenge Effects", null, null, 0);
	
	contentStack.editorTabScrolling = true;
    contentStack.addToEditor(editor, "Content", null, null, 0);
	
	generalStack.editorTabScrolling = true;
    generalStack.addToEditor(editor, "General", null, null, 0);
    
    bindings.bind();
}

var titleTextBox, typeBox, textBox, objectiveTextBox, challengeTextBox, setInfoTextBox, copyrightTextBox;

function createFrontPainter( diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	titleTextBox = createTextBox(diy, sheet, 'Mission-Card-Title');
	
	typeBox = createTextBox(diy, sheet, 'Mission-Card-Type');
	
	textBox = createTextBox(diy, sheet, 'Mission-Card-Text');
	
	objectiveTextBox = createTextBox(diy, sheet, 'Mission-Card-Objective');
	
	challengeTextBox = createTextBox(diy, sheet, 'Mission-Card-Challenge');
	
	setInfoTextBox = createTextBox(diy, sheet, 'Mission-Card-Set-Info');
	
	copyrightTextBox = createTextBox(diy, sheet, 'Mission-Card-Copyright');
	
	initBodyTags(diy, textBox);
	initBodyTags(diy, challengeTextBox);
	initMissionCardBodyTags(diy, textBox);
	initMissionCardChallengeBodyTags(diy, challengeTextBox);
	initCopyrightTags(diy, copyrightTextBox);
}

function createBackPainter( diy, sheet ) {}

function paintFront( g, diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	// Paint Template Image
	if ($MissionFrame == 'Custom') {
		PortraitList[0].paint( g, sheet.getRenderTarget() );
	}
	else {
		sheet.paintImage( g, ImageUtils.get('ebr/templates/Mission-' + $MissionFrame + '.png'), new Region(0,0,750,1050) );
	}
	
	g.setPaint(Color.BLACK);
	
	// Draw Title
	titleTextBox.markupText = diy.name;
	var missionCardTitleRegion = $$Mission-Card-Title-region.region;
	titleTextBox.draw(g, missionCardTitleRegion);
	
	// Draw Type and Traits
	var typeText = $Type;
	if($Traits != '') {
		typeText = typeText + ' <i>/ ' + $Traits + '</i>';
	}
	typeBox.markupText = typeText;
	var cardTypeRegion = $$Mission-Card-Type-region.region;
	typeBox.draw(g, cardTypeRegion);
	
	// Draw Card Text
	textBox.setLineTightness(EBRObject.bodyFontTightness);
	var cardTextRegion = $$Mission-Card-Text-region.region;
	if ($MissionFrame.slice(-4) == 'Tall' || $MissionFrame == 'Custom') {
		cardTextRegion = $$Mission-Card-Tall-Text-region.region;
	}
	
	drawMissionBodyFull( g, diy, sheet, textBox, objectiveTextBox, cardTextRegion, $CardText, $CardText2, $Objective1Type, $Objective1Name, $Objective2Type, $Objective2Name, $Objective3Type, $Objective3Name);
	
	// Draw challenge boxes
	drawChallengeEffects(g, diy, sheet, 'Mission', [ $SunEffect, $MountainEffect, $CrestEffect ]);
	
	// Draw Copyright
	copyrightTextBox.markupText = $Copyright;
	copyrightTextBox.draw(g, $$Mission-Card-Copyright-region.region);
	
	// Draw Set Info
	setInfoTextBox.markupText = $SetInfo;
	setInfoTextBox.draw(g, $$Mission-Card-Set-Info-region.region);
}

function paintBack( g, diy, sheet ) {}

function onClear() {}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead( diy, ois ) {
	if(diy.version < 2) {
		$MissionFrame = 'ValleyRegular';
		createPortraits(diy, PortraitTypeList);	
		diy.setVersion(2);
	}
	else {
		readPortraits( diy, ois, PortraitTypeList);
	}
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