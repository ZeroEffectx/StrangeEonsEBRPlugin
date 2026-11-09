importClass( ca.cgjennings.graphics.ImageUtilities );

useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );


function create( diy ) {
	diy.faceStyle = FaceStyle.ONE_FACE;
	diy.frontTemplateKey = "CampaignGuide-Page-Default";
	
	diy.name = '';
	setDefaults();
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 1;
}

function setDefaults() {
	$PageNumber = '-';
	
	$LeftText = '';
	
	$RightText = '';
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
	
	var pageList = new comboBox( EBRObject.comboPageNumbers, null );
	bindings.add("PageNumber", pageList, [0]);
	panel.place("Page Number", 'align right', pageList, 'pushx, growx, sizegroup sp');
	
	generalStack.add(panel);
	
	///// Left Text Tab /////
	let leftTextStack = new Stack();
	panel = new Grid("fillx");
	panel.setTitle("Card Text");
	
	let leftTextField = textArea("", 30, 0, true);
	bindings.add("LeftText", leftTextField, [0]);
	let leftTextLabel = label("&Card Text", leftTextField);
	panel.place(
		leftTextLabel, "wrap", leftTextField, "spany 2, pushx, growx",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
    leftTextStack.add(panel);
    
    ///// Right Text Tab /////
	let rightTextStack = new Stack();
	panel = new Grid("fillx");
	panel.setTitle("Card Text");
	
	let rightTextField = textArea("", 30, 0, true);
	bindings.add("RightText", rightTextField, [0]);
	let rightTextLabel = label("&Card Text", rightTextField);
	panel.place(
		rightTextLabel, "wrap", rightTextField, "spany 2, pushx, growx",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
    rightTextStack.add(panel);
	
	// Add all tabs to the editor in reverse display order
	rightTextStack.editorTabScrolling = true;
    rightTextStack.addToEditor(editor, "Text: Right", null, null, 0);
	
	leftTextStack.editorTabScrolling = true;
    leftTextStack.addToEditor(editor, "Text: Left", null, null, 0);
	
	generalStack.editorTabScrolling = true;
    generalStack.addToEditor(editor, "General", null, null, 0);
    
    bindings.bind();
}

var pageNumberBox, leftTextBox, rightTextBox;

function createFrontPainter( diy, sheet ) {
	
	pageNumberBox = createTextBox(diy, sheet, 'CampaignGuide-Page-NumberText');
	
	leftTextBox = createTextBox(diy, sheet, 'CampaignGuide-Page-Text');
	rightTextBox = createTextBox(diy, sheet, 'CampaignGuide-Page-Text');
	
	initBodyTags(diy, leftTextBox);
	initBodyTags(diy, rightTextBox);
}

function createBackPainter( diy, sheet ) {
	// this won't be called because the default face style
	// is a plain (unpainted) card back [FaceStyle.PLAIN_BACK]
	// in fact, we could leave this function out altogether;
	// look out for this when writing your own scripts
	// (a do-nothing function will be created to stand in
	// for any missing DIY functions, so if one of your functions
	// doesn't seem to be getting called, check the spelling
	// carefully)
}


function paintFront( g, diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	var image = ImageUtils.get('ebr/templates/CampaignGuidePage.png');
	var w = image.getWidth();
	var h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	if ($PageNumber != '-') {
		var pageBoxRegion = $$CampaignGuide-Page-NumberBox-Even-region.region;
		if ($PageNumber%2 != 0) pageBoxRegion = $$CampaignGuide-Page-NumberBox-Odd-region.region;
		
		image = ImageUtils.get('ebr/overlays/page/PageNumberBox.png');
		sheet.paintImage( g, image, pageBoxRegion );
		
		pageBoxRegion = $$CampaignGuide-Page-NumberText-Even-region.region;
		if ($PageNumber%2 != 0) pageBoxRegion = $$CampaignGuide-Page-NumberText-Odd-region.region;
		
		pageNumberBox.markupText = $PageNumber;
		pageNumberBox.draw(g, pageBoxRegion);
	}
	
	drawGuidePage(g, diy, sheet, leftTextBox, $$CampaignGuide-Page-Text-Left-region.region, $LeftText);
	drawGuidePage(g, diy, sheet, rightTextBox, $$CampaignGuide-Page-Text-Right-region.region, $RightText);
}

function paintBack( g, diy, sheet ) {
	// like createBackPainter(), this won't be called because of
	// the type of card we created
}

function onClear() {
	// this us called when the user issues a Clear command;
	// you should reset all of of the card's attributes to
	// a neutral state (the name and comments are cleared for you)
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