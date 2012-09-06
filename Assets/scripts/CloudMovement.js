#pragma strict


var MIN_SPEED : float = 0.1;
var MAX_SPEED : float = 0.5;

private var speed : float; 

function Start () 
{
	speed = Random.RandomRange(MIN_SPEED, MAX_SPEED);
}


function FixedUpdate () 
{
	transform.position += Vector3.right * speed;
}