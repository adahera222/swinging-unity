#pragma strict


var normalMaterial : Material;
var attachedMaterial : Material;


function Start () {

}

function Update () 
{
	renderer.material = hingeJoint ? attachedMaterial : normalMaterial;
}