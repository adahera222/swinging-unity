#pragma strict


var swingForceScalar : float = 10;
var swingDistance : float = 0.1;
var flapImpulseScalar : float = 2;
var diveForceScalar : float = 2;
var sideFlyingScalar : float = 2;
var timeBetweenFlaps : float = 1;
var jumpBoostScalar : float = 1;
var grabbingDrag : float = 1;

private var touchingTrigger : Collider;


function Start () 
{
	// nop
}


function FixedUpdate () 
{
	if(hingeJoint) HandleSwingControl();
	else HandleFlyingControl();
			
	if(Input.GetKey("space"))
	{
		if(!hingeJoint && touchingTrigger)
		{
			var currentPosition = transform.position;
			var otherPosition = touchingTrigger.GetComponent(Transform).position;
			
			// _this_ should be at _swingDistance_ of _touchingTrigger_
			// we assume that swingDistance < currentDistance
			if(swingDistance > Vector3.Distance(currentPosition, otherPosition)) Debug.LogError("swingDistance > currentDistance"); 
			
			var targetPosition = currentPosition + (swingDistance / Vector3.Distance(currentPosition, otherPosition)) * (currentPosition - otherPosition);
			transform.position = targetPosition;
			
			// hinge should coincide with the center of _other_ 
			var hingeLocalPosition = transform.InverseTransformPoint(otherPosition);
			
			gameObject.AddComponent("HingeJoint");
			hingeJoint.axis = Vector3.back;
			hingeJoint.anchor = hingeLocalPosition;
		}
	}
	else if(hingeJoint)
	{
		Destroy(hingeJoint);
		
		rigidbody.AddForce(rigidbody.velocity.normalized * jumpBoostScalar, ForceMode.VelocityChange);
	}

}


function OnTriggerEnter (other : Collider) 
{
	touchingTrigger = other;
}


function OnTriggerExit (other : Collider) 
{
	touchingTrigger = null;
}


function HandleSwingControl()
{
	rigidbody.drag = 0;

	if(Input.GetKey("left"))
		rigidbody.AddForce(Vector3.left * swingForceScalar, ForceMode.Acceleration);
	else if(Input.GetKey("right"))
		rigidbody.AddForce(Vector3.right * swingForceScalar, ForceMode.Acceleration);
	else if(Input.GetKey("up"))
		rigidbody.AddForce(Vector3.up * swingForceScalar, ForceMode.Acceleration);
	else if(Input.GetKey("down"))
		rigidbody.AddForce(Vector3.down * swingForceScalar, ForceMode.Acceleration);
}


function HandleFlyingControl()
{
	if(Input.GetKey("up"))
	{
		rigidbody.AddForce(new Vector3(0, 1, 0) * flapImpulseScalar, ForceMode.Acceleration);
	}
	else if(Input.GetKey("down"))
	{
		rigidbody.AddForce(new Vector3(0, -1, 0) * diveForceScalar, ForceMode.Acceleration);
	}
	
	if(Input.GetKey("left")) rigidbody.AddForce(new Vector3(-sideFlyingScalar, 0, 0), ForceMode.Acceleration);
	else if(Input.GetKey("right")) rigidbody.AddForce(new Vector3(sideFlyingScalar, 0, 0), ForceMode.Acceleration);

	if(Input.GetKey("space")) rigidbody.drag = grabbingDrag;
	else rigidbody.drag = 0;
}