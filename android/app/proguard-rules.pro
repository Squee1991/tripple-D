# 1. перепаковка
-dontwarn **
-repackageclasses ""
-allowaccessmodification
-mergeinterfacesaggressively

# 2. Мост Capacitor (JS <-> Native)
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @android.webkit.JavascriptInterface <methods>;
}
-keep class * extends com.getcapacitor.Plugin {
    public <init>(...);
}
-keepattributes JavascriptInterface,*Annotation*,Signature,InnerClasses,EnclosingMethod


# Unity Ads -keep public class *
-keep class com.unity3d.ads.** { *; }
-keep class com.unity3d.services.** { *; }
-keep public class gatewayprotocol.v1.** { *; }
-keep public class com.google.protobuf.** { *; }
-keep class com.google.ads.mediation.unity.** { *; }

# 3. АВТОРИЗАЦИЯ GOOGLE
-keep class com.capawesome.capacitorjs.plugins.googlesignin.** { *; }
-keep class com.capawesome.capacitorjs.plugins.googleauth.** { *; }
-keep class com.google.android.gms.auth.api.signin.** { *; }
-keep class com.google.firebase.auth.** { *; }
-keep class com.google.firebase.FirebaseApp { *; }
-keep class com.google.firebase.FirebaseOptions { *; }

# 4. Cordova
-keep class * extends org.apache.cordova.CordovaPlugin {
    public <init>(...);
    public boolean execute(java.lang.String, org.json.JSONArray, org.apache.cordova.CallbackContext);
}

# 5. Оптимизация
-keep class com.getcapacitor.community.tts.TextToSpeech { public *; }
-keepclassmembers class * implements android.speech.tts.TextToSpeech$OnInitListener { public void onInit(int); }
-keepclassmembers class * extends android.speech.tts.UtteranceProgressListener { <methods>; }
-keep class com.tchvu3.cancanster.VoiceRecorder { public *; }
-keep class com.tchvu3.cancanster.models.** { <fields>; }

# 6. Очистка неиспользуемых логов
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}