#pragma strict

var ropeSegment : Collider;
var swingForceScalar : float = 10;
var jumpBoostScalar : float = 5;
var ropeSegmentLength : float = 4;
var climbingMovement : float = 0.1;

private var joint : ConfigurableJoint;
private var touchingTriggers : Array = []; // of Collider


function Start () 
{
	CreateJoint();
}


function CreateJoint() : void
{
	// adjust our position to lie on the Y-axis of the rope
	var targetLocalPos : Vector3 = ropeSegment.transform.InverseTransformPoint(transform.position);
	targetLocalPos.x = 0;
	targetLocalPos.z = 0;
	
	// we want the joint to be centered on the chain, so move us there to start
	transform.position = ropeSegment.transform.position; // ropeSegment.transform.TransformPoint(targetLocalPos);
	transform.rotation = ropeSegment.transform.rotation;
				
	joint = gameObject.AddComponent("ConfigurableJoint") as ConfigurableJoint;
	joint.connectedBody = ropeSegment.rigidbody;
	joint.anchor = Vector3.zero;
	// why is this negative? are the joint axes wrong?
	joint.targetPosition = -targetLocalPos;
	joint.xMotion = ConfigurableJointMotion.Locked;
	joint.yMotion = ConfigurableJointMotion.Limited;
	joint.linearLimit.limit = 2; // TODO: replace with joint length
	joint.angularXMotion = ConfigurableJointMotion.Locked;
	joint.angularYMotion = ConfigurableJointMotion.Locked;
	joint.angularZMotion = ConfigurableJointMotion.Locked;
	joint.yDrive.mode = JointDriveMode.PositionAndVelocity;
	joint.yDrive.positionSpring = 20; // TODO: best value?
	joint.yDrive.positionDamper = 20; // TODO: best value?

	// now move us directly into position, to avoid the lag of having the joint do it
	transform.position = ropeSegment.transform.TransformPoint(targetLocalPos);
}


function Update () 
{
	if(Input.GetKey("left"))
		rigidbody.AddForce(Vector3.left * swingForceScalar, ForceMode.Acceleration);
	if(Input.GetKey("right"))
		rigidbody.AddForce(Vector3.right * swingForceScalar, ForceMode.Acceleration);
	
	if(Input.GetKey("up"))
	{
		joint.targetPosition.y -= climbingMovement;
		if(joint.targetPosition.y < -joint.linearLimit.limit / 2) 
		{
			var otherChain : Collider = Utility.FindWhere(touchingTriggers, function(i_collider : Collider)
			{
				return i_collider.tag == "rope" && i_collider != joint.connectedBody.collider;
			});
			
			if(otherChain) 
			{
				Destroy(joint);
				
				ropeSegment = otherChain;
				CreateJoint();
			}
			else
			{				
				// keep us in bounds
				joint.targetPosition.y = -joint.linearLimit.limit / 2;
			}
		}
	}
	if(Input.GetKey("down"))
	{
		joint.targetPosition.y += climbingMovement;
		if(joint.targetPosition.y > joint.linearLimit.limit / 2) 
		{
			otherChain = Utility.FindWhere(touchingTriggers, function(i_collider : Collider)
			{
				return i_collider.tag == "rope" && i_collider != joint.connectedBody.collider;
			});
			
			if(otherChain) 
			{
				Destroy(joint);
				ropeSegment = otherChain;
			}
			else
			{				
				// keep us in bounds
				joint.targetPosition.y = joint.linearLimit.limit / 2;
			}
		}
	}
}



function OnDestroy()
{
	// destroy joint and add jump boost 
	Destroy(joint);
	
	rigidbody.AddForce(rigidbody.velocity.normalized * jumpBoostScalar, ForceMode.VelocityChange);
}


function OnTriggerEnter (other : Collider) 
{
	Utility.AddToSet(touchingTriggers, other);
}


function OnTriggerExit (other : Collider) 
{
	Utility.RemoveFromSet(touchingTriggers, other);
}


