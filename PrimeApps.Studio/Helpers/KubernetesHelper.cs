using System.Collections.Generic;
using k8s;

namespace PrimeApps.Studio.Helpers
{
    public static class KubernetesHelper
    {
        static KubernetesClientConfiguration config = new KubernetesClientConfiguration { Host = "http://127.0.0.1:8001" };//TODO: Replace with actual value.
        static Kubernetes client = new Kubernetes(config);

        /*Creates ingress for new deployments. */
        static void CreateIngress(string host, string appName, bool external = false, bool useLetsEncrypt = true, bool customDomain = false, string tlsSecretName = null)
        {
            var ingress = new k8s.Models.Extensionsv1beta1Ingress()
            {
                ApiVersion = "extensions/v1beta1",
                Kind = "Ingress",
                Metadata = new k8s.Models.V1ObjectMeta()
                {
                    Name = appName,
                    NamespaceProperty = "primeapps",
                    Annotations = new Dictionary<string, string>() { { "kubernetes.io/ingress.class", "nginx" } }
                },
                Spec = new k8s.Models.Extensionsv1beta1IngressSpec()
                {
                    Tls = new List<k8s.Models.Extensionsv1beta1IngressTLS>(),
                    Rules = new List<k8s.Models.Extensionsv1beta1IngressRule>(){
                        { new k8s.Models.Extensionsv1beta1IngressRule(){
                            Host=  host,
                            Http= new k8s.Models.Extensionsv1beta1HTTPIngressRuleValue(){
                                Paths= new List<k8s.Models.Extensionsv1beta1HTTPIngressPath>(){
                                    new k8s.Models.Extensionsv1beta1HTTPIngressPath(){
                                        Path="/",
                                        Backend= new k8s.Models.Extensionsv1beta1IngressBackend(){
                                            ServiceName="primeapps-app",
                                            ServicePort=80
                                            }
                                        }
                                    }
                            }
                        }
                        }
                    }
                }

            };

            if (useLetsEncrypt)
            {
                ingress.Metadata.Annotations.Add("certmanager.k8s.io/cluster-issuer", "letsencrypt-prod");
            }

            ingress.Spec.Tls.Add(new k8s.Models.Extensionsv1beta1IngressTLS()
            {
                Hosts = new List<string>() { host },
                SecretName = "primeapps-wildcard-ssl" //TODO: Replace with actual value.
            });

            client.CreateNamespacedIngress(ingress, "primeapps");
        }
    }
}