import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-integration-extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-integration-extension:plugin',
  description: 'A JupyterLab extension for integrated Jupyter operation.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const { commands } = app;

    const urlParams = new URLSearchParams(window.location.search);

    // In critical cases Jupyter Notebooks and Jupyterlab projects should be saved when the page/frame is closed or left.
    if (urlParams.has('saveBeforeUnload')) {
      window.addEventListener("beforeunload", (evt) => {
        console.log("Saving all unsaved changes...");
        commands.execute("docmanager:save-all");
        // Prevent further 'unsaved changes' warnings in Jupyter Notebooks.
        evt.stopImmediatePropagation();
      });
      console.log("Integrated saving before unload is activated.");
    }

    // In case of previewing a Jupyter Notebook or a Jupyterlab project and making some experimental changes,
    // no 'unsaved changes' warnings should be shown when the preview is closed or left.
    if (urlParams.has('preventBeforeUnloadPropagation')) {
      window.addEventListener("beforeunload", (evt) => {
        evt.stopImmediatePropagation();
      });
    }

    // MessageEvent listener for explicit saving of a Jupyter Notebook or a Jupyterlab project.
    // This might be used, e.g., on form submissions.
    window.addEventListener("message", (evt) => {
      if (evt.data == "save-all") {
        console.log("Saving all unsaved changes...");
        commands.execute("docmanager:save-all");
      }
    });
  }
};

export default plugin;
