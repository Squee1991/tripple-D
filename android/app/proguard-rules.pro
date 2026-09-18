-dontwarn com.unity3d.ads.**
-dontwarn com.google.api.client.**
-dontwarn com.google.crypto.tink.**
-dontwarn com.amazon.device.iap.**
-dontwarn org.joda.time.**
-dontwarn com.google.firebase.**

# Мост Capacitor и JavaScriptInterface
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclasseswithmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @android.webkit.JavascriptInterface <methods>;
}
-keep class * extends com.getcapacitor.Plugin {
    public <init>(...);
}

-keepattributes JavascriptInterface
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Плагины авторизации и Cordova
-keep class com.capawesome.** {
    public protected *;
}
-keep public class org.apache.cordova.** {
    public protected *;
}
-keep class * extends org.apache.cordova.CordovaPlugin {
    public <init>(...);
}

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

-printconfiguration full-r8-config.txt

-dontwarn com.amazon.**
-keep class com.amazon.** { *; }