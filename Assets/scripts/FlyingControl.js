#pragma strict

var touchingTrigger : Collider;
var grabbingDrag : float = 1;
var flyingScalar : float = 2;
var flyingRotationVelocity : float = 5;
var flyingDecay : float = 0.1;
var minFlyingVelocity : float = 1;

private var flyingVelocity : float;

function Start () 
{
	rigidbody.freezeRotation = true;
	
	var jumpingDirection : Vector3 = rigidbody.velocity.normalized;
	var angle : float = Mathf.Atan2(jumpingDirection.x, jumpingDirection.y);
	rigidbody.rotation.SetEulerRotation(0, 0, Mathf.Rad2Deg * -angle);
	
	//print("angle is " + Mathf.Rad2Deg * angle + ", vector is "+ jumpingDirection.x + ", " + jumpingDirection.y);	

	flyingVelocity = rigidbody.velocity.magnitude;
}


function FixedUpdate () 
{
	if(Input.GetKey("space")) rigidbody.drag = grabbingDrag;
	else rigidbody.drag = 0;
	
	var currentEuleurRotation : Vector3 = rigidbody.rotation.eulerAngles;

	var targetRotation : Vector3 = currentEuleurRotation;
	if(Input.GetKey("left")) 
	{
		if(Input.GetKey("up")) targetRotation = Vector3(0, 0, 135);
		else if(Input.GetKey("down")) targetRotation = Vector3(0, 0, 225);
		else targetRotation = Vector3(0, 0, 180);
	}
	else if(Input.GetKey("right"))
	{
		if(Input.GetKey("up")) targetRotation = Vector3(0, 0, 45);
		else if(Input.GetKey("down")) targetRotation = Vector3(0, 0, 315);	
		else targetRotation = Vector3(0, 0, 0);
	}
	else if(Input.GetKey("up")) targetRotation = Vector3(0, 0, 90);
	else if(Input.GetKey("down")) targetRotation = Vector3(0, 0, 270);

	rigidbody.rotation = Quaternion.RotateTowards(rigidbody.rotation, Quaternion.Euler(targetRotation), flyingRotationVelocity);
	
	flyingVelocity = Mathf.Max(flyingVelocity - flyingDecay, minFlyingVelocity);
	rigidbody.AddRelativeForce(new Vector3(flyingVelocity, 0, 0), ForceMode.Acceleration);
}


function OnDestroy() 
{
	rigidbody.drag = 0;

	rigidbody.freezeRotation = false;
}
