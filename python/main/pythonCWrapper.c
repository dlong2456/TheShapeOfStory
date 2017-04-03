#include <stdio.h>

JNIEXPORT jint JNICALL Java_main_PythonWrapper_loadModel(JNIEnv *env, jobject obj) {
	printf("Initializing model");
	return 1;
}

JNIEXPORT jstring JNICALL Java_main_PythonWrapper_categorize(JNIEnv *env, jobject obj, jstring word) {
	printf(word);
	return word;
}