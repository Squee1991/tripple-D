# Игнорируем предупреждения от сторонних SDK
-dontwarn com.unity3d.ads.**
-dontwarn com.google.api.client.**
-dontwarn com.google.crypto.tink.**
-dontwarn com.amazon.device.iap.**
-dontwarn org.joda.time.**
-dontwarn com.google.firebase.**
-dontwarn com.amazon.**

# Мост Capacitor и JavaScriptInterface
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @android.webkit.JavascriptInterface <methods>;
}
-keep class * extends com.getcapacitor.Plugin {
    public <init>(...);
}

-keepattributes JavascriptInterface
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Плагины авторизации и Cordova (Безопасный режим для Google Auth)
-keep class com.capawesome.** { *; }
-keep class com.google.android.gms.auth.api.signin.** { *; }
-keep class com.google.firebase.auth.** { *; }

-keep class * extends org.apache.cordova.CordovaPlugin {
    public <init>(...);
    public boolean execute(...);
}

# Правила сжатия и оптимизации для Google Play
-repackageclasses ""
-allowaccessmodification
-mergeinterfacesaggressively

# Вырезание вызовов логирования для уменьшения размера DEX
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}