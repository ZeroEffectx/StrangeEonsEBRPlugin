importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );


function create( diy ) {
	diy.faceStyle = FaceStyle.PLAIN_BACK;
	diy.frontTemplateKey = "Role-Card-Default";
	diy.backTemplateKey = "Role-Card-Back-Default";
	diy.portraitKey = "Role-Card";
	
	diy.name = '';
	setDefaults();
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 1;
}

function setDefaults() {
	$SetInfo = '<bgcolor #000><white> ABC </white></bgcolor> ROLE - 1/?';
	
	$CardText = '';
	
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
	
	///// Card Text Tab /////
	let contentStack = new Stack();
	panel = new Grid("fillx");
	panel.setTitle("Card Text");
	
	let cardTextField = textArea("", 10, 0, true);
	bindings.add("CardText", cardTextField, [0]);
	let cardTextLabel = label("&Card Text", cardTextField);
	panel.place(
		cardTextLabel, "wrap", cardTextField, "spany 2, pushx, growx",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
    contentStack.add(panel);
	
	// Add all tabs to the editor in reverse display order
	contentStack.editorTabScrolling = true;
	contentStack.addToEditor(editor, "Content", null, null, 0);
	
	generalStack.editorTabScrolling = true;
    generalStack.addToEditor(editor, "General", null, null, 0);
    
    bindings.bind();
}

var titleTextBox, setInfoTextBox, textBox, artistTextBox, copyrightTextBox;

function createFrontPainter( diy, sheet ) {
	titleTextBox = createTextBox(diy, sheet, 'Role-Card-Title');
	
	textBox = createTextBox(diy, sheet, 'Ranger-Card-Text');
	
	setInfoTextBox = createTextBox(diy, sheet, 'Ranger-Card-Set-Info');
	
	artistTextBox = createTextBox(diy, sheet, 'Ranger-Card-Artist');
	
	copyrightTextBox = createTextBox(diy, sheet, 'Ranger-Card-Copyright');
	
	initCopyrightTags(diy, copyrightTextBox);
	initBodyTags(diy, textBox);
	initRangerCardBodyTags(diy, textBox);
}

function createBackPainter( diy, sheet ) {}


function paintFront( g, diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	sheet.paintPortrait(g);
	
	// Paint Template Image
	var image = ImageUtils.get('ebr/templates/Role-Card.png');
	var w = image.getWidth();
	var h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	g.setPaint(Color.BLACK);
	
	// Draw Title
	titleTextBox.markupText = diy.name;
	var roleCardTitleRegion = $$Role-Card-Title-region.region;
	titleTextBox.draw(g, roleCardTitleRegion);
	
	// Draw Card Text
	textBox.markupText = $CardText;
	textBox.setLineTightness(EBRObject.bodyFontTightness);
	textBox.draw(g, $$Role-Card-Text-region.region);
	
	// Draw Set Info
	setInfoTextBox.markupText = $SetInfo;
	drawRotatedTextBox(g, $$Role-Card-Set-Info-region.region, setInfoTextBox);
	
	// Draw Artist credit
	artistTextBox.markupText = $Artist;
	artistTextBox.draw(g, $$Role-Card-Artist-region.region);
	
	// Draw Copyright
	copyrightTextBox.markupText = $Copyright;
	copyrightTextBox.draw(g, $$Role-Card-Copyright-region.region);
}

function paintBack( g, diy, sheet ) {}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead() {}
function onWrite() {}

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