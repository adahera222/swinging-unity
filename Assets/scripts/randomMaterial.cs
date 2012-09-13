using UnityEngine;
using System.Collections;

public class randomMaterial : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
		int n= Random.Range(1,7);
		Material newMaterial;
		
		newMaterial = (Material)Resources.Load("materials/leaves"+n, typeof(Material));
		
		GetComponent<MeshRenderer>().sharedMaterial = newMaterial;
		
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
