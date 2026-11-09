importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary('diy');
useLibrary('ui');
useLibrary('markup');
useLibrary('imageutils');

importClass(arkham.component.DefaultPortrait);

const CardType = 'Path-Moment-Card';
const PortraitTypeList = [ 'TransparentPortrait-Front', 'FlavorPortrait-Front', 'BackgroundPortrait-Front', 'SetIcon-Front' ];

function create(diy) {
    diy.faceStyle = FaceStyle.TWO_FACES;
	diy.frontTemplateKey = "Path-Moment-Card-Default";
	diy.backTemplateKey = "Path-Moment-Card-Default";
	
	diy.name = '';
	setDefaults();
		
	createPortraits( diy, PortraitTypeList );
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 1.2;
}

function createInterface(diy, editor) {
	var EBRObject = Eons.namedObjects.EBRObject;

    var bindings = new Bindings(editor, diy);
    	
	let panel = new Grid("fillx");
	
	// Front Headings Panel
	let headingsSubPanel = new Grid("fillx");
	headingsSubPanel.setTitle("Headings");
	
	let nameField = textField();
	diy.setNameField(nameField);
	let nameLabel = label("&Name", nameField);
	headingsSubPanel.place(nameLabel, "split", nameField, "spanx 2, growx, wrap");
	
	let cardTypeField = textField('', 20);
	bindings.add("Type", cardTypeField, [0]);
	headingsSubPanel.place("Card Type", 'split', cardTypeField, '');
	
	let traitsField = textField('', 25);
	bindings.add("Traits", traitsField, [0]);
	headingsSubPanel.place("Traits", 'split', traitsField, 'spanx 2, wrap');
	
	var tokenValueList = new comboBox( EBRObject.comboTokens, null );
	bindings.add("TokenValue", tokenValueList, [0]);
	headingsSubPanel.place("Token Value", 'split', tokenValueList, 'pushx, growx, sizegroup sp');
	
	var tokenNameField = textField('', 25);
	bindings.add("TokenName", tokenNameField, [0]);
	headingsSubPanel.place("Token Name", 'align right, gapx 10', tokenNameField, 'spanx 2, wrap, pushx, growx, sizegroup sp');
	
	panel.place(headingsSubPanel, 'wrap');
	
	let flavorSubPanel = new Grid("fillx");
	flavorSubPanel.setTitle("Flavor");
	
	let flavorTextField = textArea("", 5, 50, true);
	bindings.add("FlavorText", flavorTextField, [0]);
	flavorSubPanel.place("Flavor Text", "split", flavorTextField, "wrap, spanx");
	
	panel.place(flavorSubPanel, 'wrap');
	
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
	panel.addToEditor(editor, "General");
	
	///////////////////////////
	///// Card Text panel /////
	///////////////////////////
	panel = new Grid("fillx");
	
	textSubPanel = new Grid('fillx');
	
	let offsetCounter = spinner( 0, 100 );
	bindings.add("HeightOffset", offsetCounter, [0]);
	textSubPanel.place( "Offset (0-100)", "wmax 100", offsetCounter, "wrap, pushx, align left");
	
	let cardTextField = textArea("", 15, 50, true);
	bindings.add("CardText", cardTextField, [0]);
	let cardTextLabel = label("&Card Text", cardTextField);
	textSubPanel.place(
		cardTextLabel, 'wrap, spanx 3',
		cardTextField, "growx, spanx 2, spany 3",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-PathMomentBodyTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
	panel.place(textSubPanel, 'wrap');
	
	challengeSubPanel = new Grid('fillx');
	challengeSubPanel.setTitle('Challenge Effects');
	
	let sunEffectField = textArea("", 5, 50, true);
	bindings.add("SunEffect", sunEffectField, [0]);
	challengeSubPanel.place("Sun Effect", "wrap", sunEffectField, "growx, wrap");
	
	let mountainEffectField = textArea("", 5, 50, true);
	bindings.add("MountainEffect", mountainEffectField, [0]);
	challengeSubPanel.place("Mountain Effect", "wrap", mountainEffectField, "growx, wrap");
	
	let crestEffectField = textArea("", 5, 50, true);
	bindings.add("CrestEffect", crestEffectField, [0]);
	challengeSubPanel.place("Crest Effect", "wrap", crestEffectField, "growx, wrap");
	
	panel.place(challengeSubPanel, 'wrap');
	panel.addToEditor(editor, "Text & Effects");
	
	////////////////////////
	///// Portrait Tab /////
	////////////////////////
	panel = new Grid("fillx");
	let headerImagePanel = new portraitPanel( diy, 0, "Portrait Adjustment" );
	panel.place( headerImagePanel, 'wrap, pushx, growx' );
	panel.setTitle("Header Frame");
	
	let flavorImagePanel = new portraitPanel( diy, 1, "Portrait Adjustment" );
	panel.place( flavorImagePanel, 'wrap, pushx, growx' );
	panel.setTitle("Flavor Text Frame");
	
	let backgroundImagePanel = new portraitPanel( diy, 2, "Portrait Adjustment" );
	panel.place( backgroundImagePanel, 'wrap, pushx, growx' );
	panel.setTitle("Background Texture");
	
	panel.addToEditor(editor, "Portrait");
	
	//////////////////////////
	//////// Set Tab /////////
	//////////////////////////
	let pathSetStack = new Stack();
	
	panel = new Grid("fillx");
	panel.setTitle("Path Set");
	
	var pathSetGrid =  new Grid();
	pathSetGrid.setTitle("Path Set");
	
	var setList = new comboBox( EBRObject.comboPathSet, null );
	bindings.add("PathSet", setList, [0]);
	pathSetGrid.place( "Path Set", 'align right', setList, 'wrap, pushx, growx, span 3');
	
	var imagePanel = new portraitPanel( diy, 3, "Custom Path Set" );
	
	panel.place(pathSetGrid, 'wrap, pushx, growx', imagePanel, 'wrap, pushx, growx' );
	pathSetStack.add(panel);
	pathSetStack.addToEditor(editor, "Set");

    bindings.bind();
}

let titleTextBox, typeBox, tokenValueBox, tokenNameBox, textBox,
	challengeTextBox, artistTextBox, setInfoTextBox, copyrightTextBox;

function createFrontPainter(diy, sheet) {
	titleTextBox = createTextBox(diy, sheet, 'Path-Moment-Card-Title');
	typeBox = createTextBox(diy, sheet, 'Path-Moment-Card-Type');
	
	tokenValueBox = createTextBox(diy, sheet, 'Path-Moment-Card-Token-Value');
	tokenNameBox = createTextBox(diy, sheet, 'Path-Moment-Card-Token-Name');
	
	flavorTextBox = createTextBox(diy, sheet, 'Path-Moment-Card-Flavor-Text');
	textBox = createTextBox(diy, sheet, 'Path-Moment-Card-Text');
	
	challengeTextBox = createTextBox(diy, sheet, 'Path-Moment-Card-Challenge');
	
	artistTextBox = createTextBox(diy, sheet, 'Path-Moment-Card-Artist');
	setInfoTextBox = createTextBox(diy, sheet, 'Path-Moment-Card-Set-Info');
	copyrightTextBox = createTextBox(diy, sheet, 'Path-Moment-Card-Copyright');
	
    initBodyTags(diy, challengeTextBox);
	initBodyTags(diy, textBox);
	initRangerCardBodyTags(diy, textBox);
	initSpecialBodyTags(diy, textBox, 'PathMoment');
	initCopyrightTags(diy, copyrightTextBox);
}

function createBackPainter(diy, sheet) { }


function paintFront(g, diy, sheet) {
    var EBRObject = Eons.namedObjects.EBRObject;
	
	var totalOffset = $HeightOffset*5;
	
	// Paint Body Image
	//sheet.paintImage( g, ImageUtils.get('ebr/overlays/path-moment/lure-moment-background.png'), new Region(0, 0, 750, 1050) );
	PortraitList[2].paint( g, sheet.getRenderTarget() );
	PortraitList[1].paint( g, sheet.getRenderTarget() );
	PortraitList[0].paint( g, sheet.getRenderTarget() );
	drawSetIcon(g, sheet, $PathSet, $$Path-Moment-Card-SetIcon-portrait-clip-region.region, true);
	
	g.setPaint(Color.BLACK);
	
	// Draw Title
	titleTextBox.markupText = diy.name;
	titleTextBox.draw(g, $$Path-Moment-Card-Title-region.region);
	
	// Draw Type and Traits
	typeBox.markupText = $Type + ($Traits != '' ? ' <i>/ ' + $Traits + '</i>' : ''); // Adds traits after type (in italics with a starting '/')
	typeBox.draw(g, $$Path-Moment-Card-Type-region.region);
	
	// Draw Flavor Text
	flavorTextBox.markupText = $FlavorText;
	var flavorBoxRegion = $TokenValue != '-' ? diy.settings.getRegion('Path-Moment-Card-Flavor-Text-Tokens-region') :
		diy.settings.getRegion('Path-Moment-Card-Flavor-Text-region');
	flavorBoxRegion.height += totalOffset;
	flavorTextBox.draw(g, flavorBoxRegion);
	
	if ($TokenValue != '-') {
		// TO DO: Figure out how to change the name color by aspect
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/path/Path-Token-Box.png'), $$Path-Moment-Card-Token-Box-region.region );
		tokenValueBox.markupText = $TokenValue;
		tokenValueBox.draw(g, $$Path-Moment-Card-Token-Value-region.region);
		tokenNameBox.markupText = $TokenName;
		tokenNameBox.draw(g, $$Path-Moment-Card-Token-Name-region.region);
	}
	
	// Draw Card Text
	textBox.markupText = $CardText;
	textBox.setLineTightness(EBRObject.bodyFontTightness);
	
	var textBoxRegion = diy.settings.getRegion('Path-Moment-Card-Text-region');
	textBoxRegion.y += totalOffset;
	textBoxRegion.height -= totalOffset;
	
	textBox.draw(g, textBoxRegion);
	
	// Draw challenge boxes
	drawChallengeEffects(g, diy, sheet, 'Path-Moment', [ $SunEffect, $MountainEffect, $CrestEffect ]);
	
	sheet.paintImage( g, ImageUtils.get('ebr/overlays/path-moment/Lure-Moment-Footer.png'), new Region(0, 1005, 750, 45));
	
	// Draw Artist credit
	artistTextBox.markupText = $Artist;
	sheet.paintImage( g, ImageUtils.get('ebr/icons/Artist-Icon-Light.png'), $$Path-Moment-Card-Artist-Icon-region.region );
	artistTextBox.draw(g, $$Path-Moment-Card-Artist-region.region);
	
	// Draw Set info
	setInfoTextBox.markupText = $SetInfo;
	setInfoTextBox.draw(g, $$Path-Moment-Card-Set-Info-region.region);
	
	// Draw Copyright
	copyrightTextBox.markupText = $Copyright;
	copyrightTextBox.draw(g, $$Path-Moment-Card-Copyright-region.region);
}

function paintBack(g, diy, sheet) {
	// Paint Body Image
	let image = ImageUtils.get('ebr/templates/Path-Card-Back.png');
	sheet.paintImage( g, image, new Region(0, 0, 750, 1050) );
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
	$Type = 'Moment';
	$Traits = '';
	
	$TokenValue = '-';
	$TokenName = '';
	
	$HeightOffset = '0';
	
	$FlavorText = '';
	$CardText = '';
	
	$SunEffect = '';
	$MountainEffect = '';
	$CrestEffect = '';
	
	$PathSet = 'Generic';
	
	$SetInfo = '<bgcolor #000><white> ABC </white></bgcolor> VALLEY MOMENTS 1 / ?';
	$Artist = '';
	$Copyright = '#EBR-Homebrew';
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