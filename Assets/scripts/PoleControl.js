#pragma strict


var pole : Collider;
var swingDistance : float = 1;
var swingForceScalar : float = 10;
var jumpBoostScalar : float = 5;


private var joint : HingeJoint;


function Start () 
{
	var currentPosition = transform.position;
	var otherPosition = pole.GetComponent(Transform).position;
	
	// _this_ should be at _swingDistance_ of _touchingTrigger_
	// we assume that swingDistance < currentDistance
	//if(swingDistance > Vector3.Distance(currentPosition, otherPosition)) Debug.LogError("swingDistance > currentDistance"); 
	
	//var targetPosition = currentPosition + (swingDistance / Vector3.Distance(currentPosition, otherPosition)) * (currentPosition - otherPosition);
	var targetPosition : Vector3 = otherPosition + (currentPosition - otherPosition).normalized * swingDistance;
	//var targetPosition = currentPosition + (swingDistance / Vector3.Distance(currentPosition, otherPosition)) * (currentPosition - otherPosition);
	transform.position = targetPosition;
	
	// hinge should coincide with the center of _other_ 
	var hingeLocalPosition = transform.InverseTransformPoint(otherPosition);
	
	joint = gameObject.AddComponent("HingeJoint");
	joint.axis = Vector3.back;
	joint.anchor = hingeLocalPosition;
}


function FixedUpdate () 
{
	if(Input.GetKey("left"))
		rigidbody.AddForce(Vector3.left * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("right"))
		rigidbody.AddForce(Vector3.right * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("up"))
		rigidbody.AddForce(Vector3.up * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("down"))
		rigidbody.AddForce(Vector3.down * swingForceScalar, ForceMode.Acceleration);
}


function OnDestroy()
{
	// destroy joint and add jump boost 
	Destroy(joint);
	
	rigidbody.AddForce(rigidbody.velocity.normalized * jumpBoostScalar, ForceMode.VelocityChange);
}
