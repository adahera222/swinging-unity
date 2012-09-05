#pragma strict

var RADIUS : float = 4;
var TIME : float = 4;
var ROTATION_TIME = 2;
var WARBLE_SPEED : float = 0.05;
var WARBLE_AMOUNT : float = 1;

private var startingPosition : Vector3;
private var lastPosition : Vector3;
private var goalPosition : Vector3;
private var lastRotation : float;
private var goalRotation : float;
private var lastTime : float;


function Start () 
{
	startingPosition = transform.position;
	goalPosition = startingPosition;
	
	InvokeRepeating("PickPosition", 0, TIME);
}


function FixedUpdate () 
{
	if(Time.fixedTime - lastTime < ROTATION_TIME) RotateUpdate();
	else FlyUpdate();
}


function RotateUpdate() : void
{
	transform.eulerAngles.z = MathFx.Hermite(lastRotation, goalRotation, (Time.fixedTime - lastTime) / ROTATION_TIME);
}


function FlyUpdate() : void
{
	var midPos : Vector3 = Utility.Hermite(lastPosition, goalPosition, (Time.fixedTime - lastTime - ROTATION_TIME) / (TIME - ROTATION_TIME));
	var warble : Vector3 = transform.up * Mathf.Sin(Time.frameCount * WARBLE_SPEED) * WARBLE_AMOUNT;
	transform.position = midPos + warble;
}


function PickPosition() : void
{
	lastTime = Time.time;
	lastPosition = goalPosition;
	lastRotation = transform.eulerAngles.z;

	goalPosition = startingPosition + Random.onUnitSphere * RADIUS;
	goalPosition.z = 0;
	
	var diffPos : Vector3 = goalPosition - lastPosition;
	goalRotation = Mathf.Rad2Deg * Mathf.Atan2(diffPos.y, diffPos.x);
}
