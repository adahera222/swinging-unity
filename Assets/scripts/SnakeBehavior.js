#pragma strict

var SPEED : float = 1;
var TIME : float = 3;

function Start () 
{
//	InvokeRepeating("PickPosition", TIME, TIME);
//	PickPosition();
}


function FixedUpdate () 
{
	transform.position += Vector3.right * SPEED;
}


/*function PickPosition() : void
{
	lastPosition = goalPosition;
	lastRotation = transform.eulerAngles.z;

	goalPosition = startingPosition + Random.onUnitSphere * RADIUS;
	goalPosition.z = 0;
	
	var diffPos : Vector3 = goalPosition - lastPosition;
	goalRotation = Mathf.Rad2Deg * Mathf.Atan2(diffPos.y, diffPos.x);
}*/