-dontwarn com.unity3d.ads.**
-dontwarn com.google.api.client.**
-dontwarn com.google.crypto.tink.**
-dontwarn com.amazon.device.iap.**
-dontwarn org.joda.time.**
-dontwarn com.google.firebase.**

# Мост Capacitor и JavaScriptInterface
-keep public class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Плагины авторизации и Cordova
-keep class com.capawesome.** { *; }
-keep public class org.apache.cordova.** { *; }
-keep class * extends org.apache.cordova.CordovaPlugin { *; }

# Правила сжатия и оптимизации для Google Play
-repackageclasses ""
-allowaccessmodification

# Вырезание вызовов логирования для уменьшения размера DEX
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}