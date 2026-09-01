#if NET10_0_OR_GREATER
using Umbraco.Cms.Core.PropertyEditors;

namespace Our.Umbraco.AnimateOnScroll.PropertyEditors
{
    /// <summary>
    /// Server-side property editor schema for Umbraco 14+ (v17/v18).
    /// The backoffice UI is the Lit element registered via App_Plugins umbraco-package.json.
    /// </summary>
    [DataEditor("Our.Umbraco.AnimateOnScroll", ValueType = ValueTypes.Json, ValueEditorIsReusable = true)]
    public class AnimateOnScrollDataEditor : DataEditor
    {
        public AnimateOnScrollDataEditor(IDataValueEditorFactory dataValueEditorFactory)
            : base(dataValueEditorFactory)
        {
        }
    }
}
#endif
