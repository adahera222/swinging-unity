using UnityEngine;
using System.Collections;

public class randomRotationZ : MonoBehaviour {

	// Use this for initialization
	void Start () {
		transform.RotateAround(Vector3.forward, Random.Range(0,360));
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
