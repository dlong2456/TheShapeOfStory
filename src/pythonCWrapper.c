#include <jni.h>
#include <stdio.h>
#include "main_PythonWrapper.h"

JNIEXPORT jint JNICALL Java_main_PythonWrapper_loadModel(JNIEnv *env, jobject obj) {
	printf("Initializing model");
	// Get a reference to the main module.
	PyObject* main_module = PyImport_AddModule("__main__");
	int x = 1;
	PyRun_SimpleString("print x");
	return 1;
}

JNIEXPORT jstring JNICALL Java_main_PythonWrapper_categorize(JNIEnv *env, jobject obj, jstring word) {
	printf("hi");
	jstring newWord;
    return newWord;
}