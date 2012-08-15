#pragma strict

var key : String = "escape";


function Start () {

}

function Update () 
{
	if(Input.GetKeyDown(key)) Application.LoadLevel(Application.loadedLevel);
}