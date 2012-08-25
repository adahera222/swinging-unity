#pragma strict

var touchingTrigger : Collider;
var grabbingDrag : float = 1;
var flyingScalar : float = 2;
var flyingRotationVelocity : float = 5;


function Start () 
{
	rigidbody.freezeRotation = true;
	
	// turn to face direction of movement
	var jumpingDirection : Vector3 = rigidbody.velocity.normalized;
	var angle : float = Mathf.Atan2(jumpingDirection.x, jumpingDirection.y);
	rigidbody.rotation.SetEulerRotation(0, 0, Mathf.Rad2Deg * -angle);
	
	/*var velocity : Vector3 = rigidbody.velocity.normalized;
	velocity.z = 0;
	
	rigidbody.rotation = Quaternion.LookRotation(velocity);*/
}


function Update () 
{
	if(Input.GetKey("space")) rigidbody.drag = grabbingDrag;
	else rigidbody.drag = 0;
	
	var currentEuleurRotation : Vector3 = rigidbody.rotation.eulerAngles;

	var targetRotation : Vector3 = currentEuleurRotation;
	if(Input.GetKey("left")) targetRotation = Vector3(0, 0, 180);
	if(Input.GetKey("right")) targetRotation = Vector3(0, 0, 0);
	if(Input.GetKey("up")) targetRotation = Vector3(0, 0, 90);
	if(Input.GetKey("down")) targetRotation = Vector3(0, 0, 270);

	rigidbody.rotation = Quaternion.RotateTowards(rigidbody.rotation, Quaternion.Euler(targetRotation), flyingRotationVelocity);
	
	rigidbody.AddRelativeForce(new Vector3(flyingScalar, 0, 0), ForceMode.Acceleration);
}


function OnDestroy() 
{
	rigidbody.drag = 0;

	rigidbody.freezeRotation = false;
}
